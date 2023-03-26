import {format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {getRandomTaiwanId} from 'taiwan-id';
import {TdxApi} from 'tdx-api';
import {expect, test} from 'vitest';

import {ticketFlow} from './ticketFlow';
import {timeZone} from './utils/constants';

test('Book Ticket By Time', async () => {
  const tdxApi = new TdxApi();
  const availableDates = await tdxApi.getAvailableDates();
  const lastDateString = availableDates.data.EndDate;
  /**
   * Taiwan 11 AM
   */
  const date = new Date(`${lastDateString}T03:00:00.000Z`);
  const ticketDate = utcToZonedTime(date, timeZone);

  const taiwanId = getRandomTaiwanId();

  const ticketResult = await ticketFlow({
    startStation: 'NanGang',
    endStation: 'TaiPei',
    ticketDate,
    bookingMethod: 'time',
    trainNo: 0,
    carType: 'Standard',
    seatType: 'NoRequired',
    taiwanId,
    email: '',
    phone: '',
    adultTicket: 1,
    childTicket: 0,
    disabledTicket: 0,
    elderTicket: 0,
    collegeTicket: 0,
    memberType: 'NotMember',
  });
  expect(ticketResult).toBeDefined();
  // Check Date
  expect(ticketResult.date === format(ticketDate, 'MM-dd')).toBe(true);

  // Check departure time is greater than expected time
  const departureTime = parseInt(
    ticketResult.departureTime.split(':').join(''),
  );
  const expectedDepartureTime = parseInt(format(ticketDate, 'HHmm'));
  expect(departureTime >= expectedDepartureTime).toBe(true);
});

test('Book Ticket By TrainNo', async () => {
  const tdxApi = new TdxApi();
  const availableDates = await tdxApi.getAvailableDates();
  const lastDateString = availableDates.data.EndDate;

  const randomTrainNo = 825;

  const ticketDate = new Date(lastDateString);
  const taiwanId = getRandomTaiwanId();

  const ticketResult = await ticketFlow({
    startStation: 'NanGang',
    endStation: 'TaiPei',
    ticketDate,
    bookingMethod: 'trainNo',
    trainNo: randomTrainNo,
    carType: 'Standard',
    seatType: 'NoRequired',
    taiwanId,
    email: '',
    phone: '',
    adultTicket: 1,
    childTicket: 0,
    disabledTicket: 0,
    elderTicket: 0,
    collegeTicket: 0,
    memberType: 'NotMember',
  });
  expect(ticketResult).toBeDefined();
  expect(ticketResult.trainNo === randomTrainNo).toBe(true);
  // Check Date
  expect(ticketResult.date === format(ticketDate, 'MM-dd')).toBe(true);
});
