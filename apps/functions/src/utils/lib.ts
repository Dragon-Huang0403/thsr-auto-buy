import crawler from 'crawler';
import database from 'database';
import {millisecondsInMinute} from 'date-fns';
import * as functions from 'firebase-functions';
import got from 'got';
import ticketFlow from 'ticket-flow';

import {getFunctionUrl, waitingUntilSecond} from './helper';
import {prisma, PrismaWithoutPgBouncer} from './prisma';
import {ticketFlowRequestSchema} from './schema';

const {Prisma} = database;
const {crawlDiscounts, crawlSpecialDays} = crawler;

export const maxInstances = 99;
export async function handleTicketFlow(
  request: Zod.infer<typeof ticketFlowRequestSchema>,
) {
  const {id: reservationId, ...ticketFlowRequest} = request;
  try {
    const ticketResult = await ticketFlow(ticketFlowRequest);
    await prisma.ticketResult.create({
      data: {
        reservationId,
        ticketId: ticketResult.ticketId,
        trainNo: ticketResult.trainNo,
        departureTime: ticketResult.departureTime,
        arrivalTime: ticketResult.arrivalTime,
        duration: ticketResult.duration,
        totalPrice: ticketResult.totalPrice,
      },
    });
    functions.logger.info(`>> Success, reservationId: ${reservationId}`);
    return ticketResult;
  } catch (e) {
    functions.logger.error(`>> Failed to Book ReservationId: ${reservationId}`);
    functions.logger.error(e);
    const error = e instanceof Error ? e : undefined;
    await prisma.ticketError.create({
      data: {
        reservationId,
        message: error?.message ?? '',
      },
    });
    // In case race condition happens due to manually calling reserving function
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return;
    }
    throw e;
  }
}

export async function handleDispatchReservations(
  bookDate: Date,
  {waitUntilMidnight} = {waitUntilMidnight: false},
) {
  const reservations = await prisma.reservation.findMany({
    where: {
      bookDate,
      isDeleted: false,
      ticketResult: null,
    },
    take: maxInstances,
  });
  const bookTicketUrl = getFunctionUrl('bookTicket');

  // Hold to almost next minute
  if (waitUntilMidnight) {
    await waitingUntilSecond(45);
  }

  functions.logger.info(`>> Start Dispatching ${reservations.length} jobs`);

  await Promise.all(
    reservations.map(reservation =>
      got
        .post(bookTicketUrl, {
          json: {...reservation, waitUntilMidnight},
          timeout: {response: millisecondsInMinute},
        })
        // TODO: Handle timeout error
        .catch(res => res),
    ),
  );

  return reservations;
}

export async function updateSpecialBookDays(prisma: PrismaWithoutPgBouncer) {
  const [specialDays] = await Promise.all([
    crawlSpecialDays(),
    prisma.specialBookDay.deleteMany({}),
  ]);

  await prisma.specialBookDay.createMany({data: specialDays});
  return specialDays;
}

export async function updateDiscounts(prisma: PrismaWithoutPgBouncer) {
  const discounts = await crawlDiscounts();

  // Using `Truncate` is much faster than using `prisma.discount.deleteMany`
  await prisma.$queryRawUnsafe(`Truncate "Discount" restart identity cascade`);

  await prisma.discount.createMany({data: discounts});
  return discounts;
}
