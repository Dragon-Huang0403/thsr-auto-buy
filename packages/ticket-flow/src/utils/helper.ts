import {format} from 'date-fns';
import {formatInTimeZone, utcToZonedTime} from 'date-fns-tz';

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
import {TicketFlowError, TicketFlowErrorType} from './ticketFlowError';

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

export async function waitingUntilMidnight() {
  let now = new Date();

  // Wait until 00:00:01, because thsr will start count as next day after 00:00:01
  while (
    formatInTimeZone(now, timeZone, 'H') !== '0' ||
    now.getSeconds() === 0
  ) {
    await sleep(500);
    now = new Date();
  }
}

export function getTimeTableValue(date: Date) {
  const hourAndMinute = parseInt(format(date, 'HHmm'));
  const timeOption = timeOptions.find(option => option.time > hourAndMinute);
  if (!timeOption) {
    throw new TicketFlowError(
      TicketFlowErrorType.badRequest,
      'Get time table value failed',
    );
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
  throw new TicketFlowError(
    TicketFlowErrorType.badRequest,
    'Not support business member type yet',
  );
}

export function isCaptchaError(error: unknown) {
  if (error instanceof TicketFlowError) {
    return error.type === TicketFlowErrorType.solvingCaptchaWrong;
  }
  return false;
}

export function isSentTooEarlyError(error: unknown) {
  if (!(error instanceof TicketFlowError)) {
    return false;
  }
  return error.message.includes('去程您所選擇的日期超過目前開放預訂之日期');
}
