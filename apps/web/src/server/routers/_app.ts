/**
 * This file contains the root router of your tRPC-backend
 */
import {publicProcedure, router} from '../trpc';
import {reservationRouter} from './reservation';
import {timeRouter} from './time';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  reservation: reservationRouter,
  time: timeRouter,
});

export type AppRouter = typeof appRouter;
