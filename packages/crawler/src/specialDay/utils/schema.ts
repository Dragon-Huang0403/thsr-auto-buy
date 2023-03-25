import {z} from 'zod';

import {isValidateDate} from '../../utils/helpers';

/**
 * ISO Date String: yyyy-mm-dd
 */
export const dateStringSchema = z
  .string()
  .refine(isValidateDate)
  .transform(str => new Date(str));

export const specialDaySchema = z.object({
  name: z.string(),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  startBookDay: dateStringSchema,
});
