import {checkTaiwanId} from 'taiwan-id';
import {z} from 'zod';

import {
  bookingMethods,
  carTypes,
  memberTypes,
  seatTypes,
  stations,
} from './constants';
import {sumAll} from './helpers';

export const reservationSchema = z.object({
  startStation: z.enum(stations),
  endStation: z.enum(stations),
  ticketDate: z.date(),
  bookingMethod: z.enum(bookingMethods),
  trainNo: z.string().min(3).max(4),
  carType: z.enum(carTypes),
  seatType: z.enum(seatTypes),
  taiwanId: z
    .string()
    .refine(str => checkTaiwanId(str).success, '身分證字號格式錯誤'),
  email: z.literal('').or(z.string().email('電子信箱格式錯誤')),
  phone: z.string(),
  tickets: z
    .object({
      adultTicket: z.number(),
      childTicket: z.number(),
      disabledTicket: z.number(),
      elderTicket: z.number(),
      collegeTicket: z.number(),
    })
    .refine(tickets => {
      const numbers = Object.values(tickets);
      const sum = sumAll(numbers);
      return z.number().min(1).max(10).safeParse(sum).success;
    }, '單次最多購買 10 張票'),
  memberType: z.enum(memberTypes),
});

export const timeSearchSchema = reservationSchema.pick({
  startStation: true,
  endStation: true,
  ticketDate: true,
});
export type TimeSearchParams = z.infer<typeof timeSearchSchema>;
