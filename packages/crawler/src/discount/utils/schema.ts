import {z} from 'zod';

import {isValidateDate} from '../../utils/helpers';
import {TableType} from './constants';

/**
 * ISO Date String: yyyy-mm-dd
 */
export const dateStringSchema = z
  .string()
  .refine(isValidateDate)
  .transform(str => new Date(str));

export const trainTableDateSchema = z.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});
const ratio = z.number().int().finite();

const discountDetailSchema = z
  .object({
    minRatio: ratio,
    discountRatios: z.array(ratio),
  })
  .or(z.null());

const trainItemBaseSchema = z.object({
  trainNo: z.number(),
});

export const regularTrainItemSchema = trainItemBaseSchema.extend({
  tableType: z.literal(TableType.regular).default(TableType.regular),
  trainNo: z.number(),
  details: z.array(discountDetailSchema).length(7),
});

export const specialDayTrainItemSchema = trainItemBaseSchema.extend({
  tableType: z.literal(TableType.specialDays).default(TableType.specialDays),
  date: dateStringSchema,
  detail: discountDetailSchema,
});
