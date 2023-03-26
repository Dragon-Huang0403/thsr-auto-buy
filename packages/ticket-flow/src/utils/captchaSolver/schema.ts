import {z} from 'zod';

export const twoCaptchaResponseSchema = z
  .object({
    status: z.literal(1),
    request: z.string(),
  })
  .or(z.object({status: z.literal(0)}));

export const capSolverResponse = z.object({
  solution: z.object({
    text: z.string(),
  }),
});
