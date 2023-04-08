import {addDays, millisecondsInSecond, secondsInMinute} from 'date-fns';
import * as functions from 'firebase-functions';

import {asiaEast, asiaTaiPei, secrets} from './utils/constants';
import {getAsiaTaiPeiDate, retryIfThrow} from './utils/helper';
import {
  handleDispatchReservations,
  handleTicketFlow,
  maxInstances,
  updateDiscounts,
  updateSpecialBookDays,
} from './utils/lib';
import {createPrismaClientWithoutPgBouncer} from './utils/prisma';
import {ticketFlowRequestSchema} from './utils/schema';

const functionBase = functions.region(asiaEast);

export const updateTrainInfos = functionBase
  .runWith({
    secrets: [secrets.DATABASE_DIRECT_URL],
    timeoutSeconds: secondsInMinute,
  })
  .https.onRequest(async (_, response) => {
    const prismaWithoutPgBouncer = createPrismaClientWithoutPgBouncer();

    functions.logger.info('>> Start update special book days');
    const specialBookDay = await updateSpecialBookDays(prismaWithoutPgBouncer);
    functions.logger.info('>> Finish update special book days');

    functions.logger.info('>> Start update discounts');
    const discounts = await updateDiscounts(prismaWithoutPgBouncer);
    functions.logger.info('>> Finish update discounts');

    await prismaWithoutPgBouncer.$disconnect();

    response.json({discounts, specialBookDay});
  });

const dispatchTimeout = secondsInMinute * 2;
export const dispatchReservationsBeforeMidnight = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: dispatchTimeout,
  })
  .pubsub.schedule('59 23 * * 0-4')
  .timeZone(asiaTaiPei)
  .onRun(async () => {
    const asiaTaiPeiDate = getAsiaTaiPeiDate();
    const bookDate = addDays(asiaTaiPeiDate, 1);
    await handleDispatchReservations(bookDate, {waitUntilMidnight: true});
  });

export const dispatchReservationsAtZeroToOneClockEveryFiveMinutes = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: dispatchTimeout,
  })
  .pubsub.schedule('5,10,15,20,25,30,35,40,45,50,55 0-1 * * 1-5')
  .timeZone(asiaTaiPei)
  .onRun(async () => {
    const bookDate = getAsiaTaiPeiDate();
    await handleDispatchReservations(bookDate);
  });

export const dispatchReservationsOnRequest = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: dispatchTimeout,
  })
  .https.onRequest(async (request, response) => {
    const bookDate = getAsiaTaiPeiDate();
    const reservations = await handleDispatchReservations(bookDate);
    response.json({counts: reservations.length, data: reservations});
  });

const bookTicketTimeout = secondsInMinute * 5;
export const bookTicket = functionBase
  .runWith({
    timeoutSeconds: bookTicketTimeout,
    secrets: [
      secrets.DATABASE_URL,
      secrets.CAPTCHA_SOLVER,
      secrets.CAPTCHA_KEY,
    ],
    maxInstances,
  })
  .https.onRequest(async (request, response) => {
    const check = ticketFlowRequestSchema.safeParse(request.body);
    if (!check.success) {
      functions.logger.error('Parse Snapshot Failed');
      functions.logger.error(check.error.message);
      response.status(400).send('Bad Request');
      return;
    }
    const reservationId = check.data.id;
    functions.logger.info(`>> Start Booking ReservationId: ${reservationId}`);

    const retryOptions = {
      delayMs: millisecondsInSecond,
      /**
       * set retryMaxAgeMs = timeoutSeconds * 0.9 for avoiding timeout
       */
      retryMaxAgeMs: bookTicketTimeout * millisecondsInSecond,
      startTime: Date.now(),
    };
    await retryIfThrow(() => handleTicketFlow(check.data), retryOptions);

    response.send(`>> Success Booking ReservationId: ${reservationId}`);
  });
