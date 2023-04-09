import {z} from 'zod';

import {
  bookingMethods,
  carTypes,
  memberTypes,
  seatTypes,
  stations,
} from './constants';

export const ticketFlowRequestSchema = z.object({
  id: z.number(),
  startStation: z.enum(stations),
  endStation: z.enum(stations),
  ticketDate: z
    .string()
    .datetime()
    .transform(str => new Date(str)),
  bookingMethod: z.enum(bookingMethods),
  trainNo: z.number(),
  carType: z.enum(carTypes),
  seatType: z.enum(seatTypes),
  taiwanId: z.string(),
  email: z.string(),
  phone: z.string(),
  adultTicket: z.number(),
  childTicket: z.number(),
  disabledTicket: z.number(),
  elderTicket: z.number(),
  collegeTicket: z.number(),
  memberType: z.enum(memberTypes),
  waitUntilMidnight: z.boolean().default(false),
  retry: z.boolean().default(false),
});

const booleanStringSchema = z
  .string()
  .default('')
  .transform(str => str === 'true');

export const dispatchReservationOptionsSchema = z.object({
  waitUntilMidnight: booleanStringSchema,
  retry: booleanStringSchema,
  selectSoldOut: booleanStringSchema,
});
