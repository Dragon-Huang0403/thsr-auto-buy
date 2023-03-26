import {Got} from 'got';

import {confirmTrain, submitTicket} from './steps';
import {TicketFlowRequest} from './types';
import {
  getMemberRequestData,
  handleTicketFlowRequestData,
} from './utils/helper';
import {requestFillers} from './utils/requestFillers';

interface BookTicketByTrainNoFlowRequest {
  client: Got;
  request: TicketFlowRequest;
  bookingMethod: string;
  captchaResult: string;
}

export async function bookByTrainNoFlow({
  client,
  request,
  bookingMethod,
  captchaResult,
}: BookTicketByTrainNoFlowRequest) {
  const {bookingOptions, passengerCount, buyerInfo} =
    handleTicketFlowRequestData(request);

  const fillers = requestFillers.bookByTrainNo;

  // Step 1
  const memberValues = await confirmTrain(client, {
    ...fillers.confirmTrain,
    ...bookingOptions,
    bookingMethod,
    'homeCaptcha:securityCode': captchaResult,
  });
  const memberRequestData = getMemberRequestData(
    request.memberType,
    memberValues,
    request.taiwanId,
  );

  // Step 2
  const ticketResult = await submitTicket(client, {
    ...fillers.submitTicket,
    ...buyerInfo,
    ...memberRequestData,
    passengerCount,
  });

  return ticketResult;
}
