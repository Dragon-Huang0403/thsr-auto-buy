/**
 * This file contains the root router of your tRPC-backend
 */
import {publicProcedure, router} from '../trpc';
import {reservationRouter} from './reservation';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  reservation: reservationRouter,
});

export type AppRouter = typeof appRouter;
