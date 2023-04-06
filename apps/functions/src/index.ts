import crawler from 'crawler';
import {addDays, millisecondsInMinute, secondsInMinute} from 'date-fns';
import * as functions from 'firebase-functions';
import got from 'got';

import {asiaEast, asiaTaiPei, secrets} from './utils/constants';
import {
  getAsiaTaiPeiDate,
  getBookTicketUrl,
  handleTicketFlow,
  retryIfThrow,
  sleep,
  withPrisma,
} from './utils/helper';
import {ticketFlowRequestSchema} from './utils/schema';

const {crawlDiscounts, crawlSpecialDays} = crawler;

const functionBase = functions.region(asiaEast);

export const crawlDiscountsAndUpdate = functionBase
  .runWith({secrets: [secrets.DATABASE_URL], timeoutSeconds: secondsInMinute})
  .https.onRequest(async (_, response) => {
    await withPrisma(async prisma => {
      const [discounts] = await Promise.all([
        crawlDiscounts(),
        prisma.discount.deleteMany({}),
      ]);

      response.json({data: discounts, counts: discounts.length});
      await prisma.discount.createMany({data: discounts});
    });
  });

export const crawlSpecialDaysAndUpdate = functionBase
  .runWith({secrets: [secrets.DATABASE_URL]})
  .https.onRequest(async (_, response) => {
    await withPrisma(async prisma => {
      const [specialDays] = await Promise.all([
        crawlSpecialDays(),
        prisma.specialBookDay.deleteMany({}),
      ]);

      response.json({data: specialDays, counts: specialDays.length});
      await prisma.specialBookDay.createMany({data: specialDays});
    });
  });

export const dispatchReservationsBeforeMidnight = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: secondsInMinute * 2,
  })
  .pubsub.schedule('59 23 * * *')
  .timeZone(asiaTaiPei)
  .onRun(async () => {
    await withPrisma(async prisma => {
      const asiaTaiPeiDate = getAsiaTaiPeiDate();
      const bookDate = addDays(asiaTaiPeiDate, 1);
      const reservations = await prisma.reservation.findMany({
        where: {
          bookDate,
          isDeleted: false,
          ticketResult: null,
        },
      });
      const bookTicketUrl = getBookTicketUrl();

      while (new Date().getSeconds() < 45) {
        await sleep(500);
      }
      functions.logger.info(`>> Dispatch ${reservations.length} jobs`);
      await Promise.all(
        reservations.map(async reservation => {
          await got.post(bookTicketUrl, {
            json: {...reservation, waitUntilMidnight: true},
          });
        }),
      );
    });
  });

export const dispatchReservationsAtZeroClockEveryFiveMinutes = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: secondsInMinute,
  })
  .pubsub.schedule('5,10,15,20,25,30,35,40,45,50,55 0 * * *')
  .timeZone(asiaTaiPei)
  .onRun(async () => {
    await withPrisma(async prisma => {
      const bookDate = getAsiaTaiPeiDate();
      const reservations = await prisma.reservation.findMany({
        where: {
          bookDate,
          isDeleted: false,
          ticketResult: null,
        },
      });
      const bookTicketUrl = getBookTicketUrl();
      functions.logger.info(`>> Dispatch ${reservations.length} jobs`);
      await Promise.all(
        reservations.map(async reservation => {
          await got.post(bookTicketUrl, {
            json: reservation,
          });
        }),
      );
    });
  });

export const dispatchReservationsAtOneClockEveryTenMinutes = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: secondsInMinute,
  })
  .pubsub.schedule('*/10 1 * * *')
  .timeZone(asiaTaiPei)
  .onRun(async () => {
    await withPrisma(async prisma => {
      const bookDate = getAsiaTaiPeiDate();
      const reservations = await prisma.reservation.findMany({
        where: {
          bookDate,
          isDeleted: false,
          ticketResult: null,
        },
      });
      const bookTicketUrl = getBookTicketUrl();
      functions.logger.info(`>> Dispatch ${reservations.length} jobs`);
      await Promise.all(
        reservations.map(async reservation => {
          await got.post(bookTicketUrl, {
            json: reservation,
          });
        }),
      );
    });
  });
export const dispatchReservationsOnRequest = functionBase
  .runWith({
    secrets: [secrets.DATABASE_URL],
    timeoutSeconds: secondsInMinute,
  })
  .https.onRequest(async (request, response) => {
    await withPrisma(async prisma => {
      const bookDate = getAsiaTaiPeiDate();
      const reservations = await prisma.reservation.findMany({
        where: {
          bookDate,
          isDeleted: false,
          ticketResult: null,
        },
      });
      const bookTicketUrl = getBookTicketUrl();
      functions.logger.info(`>> Dispatch ${reservations.length} jobs`);
      await Promise.all(
        reservations.map(async reservation => {
          await got.post(bookTicketUrl, {
            json: reservation,
          });
        }),
      );
      response.json({counts: reservations.length, data: reservations});
    });
  });

export const bookTicket = functionBase
  .runWith({
    timeoutSeconds: secondsInMinute * 5,
    secrets: [
      secrets.DATABASE_URL,
      secrets.CAPTCHA_SOLVER,
      secrets.CAPTCHA_KEY,
    ],
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
    response.send(`>> Start Booking ReservationId: ${reservationId}`);
    functions.logger.info(`>> Start Booking ReservationId: ${reservationId}`);

    await withPrisma(async prisma => {
      const retryOptions = {
        delayMs: 500,
        retryMaxAgeMs: millisecondsInMinute * 4.5,
        startTime: Date.now(),
      };
      await retryIfThrow(
        () => handleTicketFlow(check.data, prisma),
        retryOptions,
      );
    });
  });
