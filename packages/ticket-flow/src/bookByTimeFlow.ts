import {Got} from 'got';

import {confirmTrain, getAvailableTrains, submitTicket} from './steps';
import {TicketFlowRequest} from './types';
import {
  getMemberRequestData,
  getTrainValue,
  handleTicketFlowRequestData,
} from './utils/helper';
import {requestFillers} from './utils/requestFillers';

interface BookTicketByTimeFlowRequest {
  client: Got;
  request: TicketFlowRequest;
  bookingMethod: string;
  captchaResult: string;
}

export async function bookByTimeFlow({
  client,
  request,
  bookingMethod,
  captchaResult,
}: BookTicketByTimeFlowRequest) {
  const {bookingOptions, passengerCount, buyerInfo, ticketDate} =
    handleTicketFlowRequestData(request);
  const fillers = requestFillers.bookByTime;

  // Step 1
  const trainItems = await getAvailableTrains(client, {
    ...bookingOptions,
    ...fillers.getAvailableTrains,
    bookingMethod,
    'homeCaptcha:securityCode': captchaResult,
  });
  const trainValue = getTrainValue(trainItems, ticketDate);

  // Step 2
  const memberValues = await confirmTrain(client, {
    ...fillers.confirmTrain,
    'TrainQueryDataViewPanel:TrainGroup': trainValue,
  });
  const memberRequestData = getMemberRequestData(
    request.memberType,
    memberValues,
    request.taiwanId,
  );

  // Step 3
  const ticketResult = await submitTicket(client, {
    ...fillers.submitTicket,
    ...buyerInfo,
    ...memberRequestData,
    passengerCount,
  });

  return ticketResult;
}
