import {format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';

import {
  BookingOptions,
  BuyerInfo,
  MemberType,
  MemberValues,
  TicketFlowRequest,
  TrainItem,
} from '../types';
import {
  carTypeValues,
  seatTypeValues,
  stationValues,
  timeOptions,
  timeZone,
  tripTypeValues,
} from './constants';

/**
 *
 * @param time Milliseconds
 * @returns
 */
export async function sleep(time: number) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}

function getTimeTableValue(date: Date) {
  const hourAndMinute = parseInt(format(date, 'HHmm'));
  const timeOption = timeOptions.find(option => option.time > hourAndMinute);
  if (!timeOption) {
    throw new Error('Get Time Table Value Failed');
  }
  return timeOption.value;
}
function getPassengerCount(result: TicketFlowRequest) {
  const {adultTicket, childTicket, disabledTicket, elderTicket, collegeTicket} =
    result;
  return (
    adultTicket + childTicket + disabledTicket + elderTicket + collegeTicket
  );
}

export function handleTicketFlowRequestData(request: TicketFlowRequest) {
  const {bookingMethod} = request;
  const selectStartStation = stationValues[request.startStation];
  const selectDestinationStation = stationValues[request.endStation];
  const ticketDate = utcToZonedTime(request.ticketDate, timeZone);
  const toTimeInputField = format(ticketDate, 'yyyy/MM/dd');
  const toTrainIDInputField =
    bookingMethod === 'trainNo' ? request.trainNo.toString() : '';
  const toTimeTable =
    bookingMethod === 'time' ? getTimeTableValue(ticketDate) : '';

  const bookingOptions: BookingOptions = {
    selectStartStation,
    selectDestinationStation,
    toTimeInputField,
    'trainCon:trainRadioGroup': carTypeValues[request.carType],
    'seatCon:seatRadioGroup': seatTypeValues[request.seatType],
    'tripCon:typesoftrip': tripTypeValues.single,
    'ticketPanel:rows:0:ticketAmount': `${request.adultTicket}F`,
    'ticketPanel:rows:1:ticketAmount': `${request.childTicket}H`,
    'ticketPanel:rows:2:ticketAmount': `${request.disabledTicket}W`,
    'ticketPanel:rows:3:ticketAmount': `${request.elderTicket}E`,
    'ticketPanel:rows:4:ticketAmount': `${request.collegeTicket}P`,
    toTimeTable,
    toTrainIDInputField,
  };
  const passengerCount = getPassengerCount(request);

  const buyerInfo: BuyerInfo = {
    dummyId: request.taiwanId,
    dummyPhone: request.phone,
    email: request.email,
  };

  return {bookingOptions, passengerCount, buyerInfo, ticketDate};
}

export function getTrainValue(
  trainItems: [TrainItem, ...TrainItem[]],
  ticketDate: Date,
) {
  const hourAndMinute = parseInt(format(ticketDate, 'HHmm'));
  const target = trainItems.find(trainItem => {
    const time = parseInt(trainItem.departureTime.replace(':', ''));
    return time > hourAndMinute;
  });
  if (!target) {
    return trainItems[0].value;
  }
  return target.value;
}

export function objectKeys<
  T extends Record<string, unknown>,
  Key extends keyof T,
>(object: T) {
  const keys = Object.keys(object) as Key[];
  return keys;
}

export function getMemberRequestData(
  memberType: MemberType,
  memberValues: MemberValues,
  taiwanId: string,
) {
  const memberValue = memberValues[memberType];
  if (memberType === 'NotMember') {
    return {
      'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup':
        memberValue,
      agree: 'on',
    } as const;
  }
  if (memberType === 'Member') {
    return {
      'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup':
        memberValue,
      'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup:memberShipNumber':
        taiwanId,
      'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup:memberSystemShipCheckBox':
        'on',
    } as const;
  }
  throw new Error('Not support business member type yet');
}
