/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import {addDays, differenceInSeconds} from 'date-fns';

import {createContext} from '~/server/context';
import {appRouter} from '~/server/routers/_app';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({error}) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  responseMeta({paths, type, errors}) {
    const allTime = paths && paths.every(path => path.includes('time'));

    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === 'query';
    if (allTime && allOk && isQuery) {
      // cache request for same day + revalidate once every second
      const now = new Date();
      const tomorrow = addDays(new Date(now.toISOString().slice(0, 10)), 1);
      const diffSeconds = differenceInSeconds(tomorrow, now);
      return {
        headers: {
          'cache-control': `s-maxage=1, stale-while-revalidate=${diffSeconds}`,
        },
      };
    }
    return {};
  },
});
