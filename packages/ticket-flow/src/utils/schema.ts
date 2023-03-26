import {z} from 'zod';

const radioValueSchema = z.string().regex(/^radio\d{2}$/);
const hourAndMinuteSchema = z.string().regex(/^\d{1,2}:\d{2}$/);
const stringNumberSchema = z.string().regex(/\d+/);
const onlyNumberStringSchema = z.string().regex(/^\d+$/);
const trainNoSchema = onlyNumberStringSchema.transform(str => parseInt(str));

export const bookingMethodsSchema = z.object({
  time: radioValueSchema,
  trainNo: radioValueSchema,
});

export const trainItemSchema = z.object({
  value: radioValueSchema,
  duration: hourAndMinuteSchema,
  departureTime: hourAndMinuteSchema,
  arrivalTime: hourAndMinuteSchema,
  trainNo: trainNoSchema,
});

export const memberValuesSchema = z.object({
  NotMember: radioValueSchema,
  Member: radioValueSchema,
  Business: radioValueSchema,
});

export const ticketResultSchema = z.object({
  ticketId: onlyNumberStringSchema,
  trainNo: trainNoSchema,
  departureTime: hourAndMinuteSchema,
  departureStation: z.string(),
  arrivalTime: hourAndMinuteSchema,
  arrivalStation: z.string(),
  date: z
    .string()
    .regex(/\d{2}\/\d{2}/)
    .transform(str => str.split('/').join('-')),
  totalPrice: stringNumberSchema.transform(str => {
    const numbers = str.match(/\d+/g)?.join('');
    return parseInt(numbers ?? '0');
  }),
});
