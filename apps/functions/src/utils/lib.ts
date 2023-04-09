import {crawlDiscounts, crawlSpecialDays} from 'crawler';
import database from 'database';
import {millisecondsInMinute} from 'date-fns';
import * as functions from 'firebase-functions';
import got from 'got';
import ticketFlow, {TicketFlowError} from 'ticket-flow';

import {
  getFunctionUrl,
  isDoubleBookingError,
  waitingUntilSecond,
} from './helper';
import {prisma, PrismaWithoutPgBouncer} from './prisma';
import {ticketFlowRequestSchema} from './schema';

const {TicketErrorType} = database;

export const maxInstances = 99;
export async function handleTicketFlow(
  request: Zod.infer<typeof ticketFlowRequestSchema>,
) {
  const {id: reservationId, ...ticketFlowRequest} = request;
  try {
    const ticketResult = await ticketFlow(ticketFlowRequest);
    const data = {
      reservationId,
      ticketId: ticketResult.ticketId,
      trainNo: ticketResult.trainNo,
      departureTime: ticketResult.departureTime,
      arrivalTime: ticketResult.arrivalTime,
      duration: ticketResult.duration,
      totalPrice: ticketResult.totalPrice,
    };
    functions.logger.info(`>> Success, reservationId: ${reservationId}`, data);
    await prisma.ticketResult.create({data});
    return data;
  } catch (e) {
    functions.logger.error(
      `>> Failed to Book ReservationId: ${reservationId}`,
      e,
    );

    const error = e as Error;
    const errorType =
      error instanceof TicketFlowError ? error.type : TicketErrorType.unknown;

    await prisma.ticketError.create({
      data: {
        errorType,
        reservationId,
        message: error?.message ?? '',
      },
    });

    if (isDoubleBookingError(error)) {
      return;
    }

    if (errorType === TicketErrorType.soldOut) {
      await prisma.reservation.update({
        where: {id: reservationId},
        data: {
          isSoldOut: true,
        },
      });
      return;
    }
    if (errorType === TicketErrorType.badRequest) {
      await prisma.reservation.update({
        where: {id: reservationId},
        data: {
          isBadRequest: true,
        },
      });
      return;
    }

    throw e;
  }
}

type DispatchReservationOptions = {
  selectSoldOut?: boolean;
  waitUntilMidnight?: boolean;
  retry?: boolean;
};

export async function handleDispatchReservations(
  bookDate: Date,
  options: DispatchReservationOptions = {},
) {
  const {waitUntilMidnight, selectSoldOut, retry} = options;

  const reservations = await prisma.reservation.findMany({
    where: {
      bookDate,
      isDeleted: false,
      ticketResult: null,
      isBadRequest: false,
      isSoldOut: selectSoldOut ? undefined : false,
    },
    take: maxInstances,
    orderBy: {
      createdAt: 'asc',
    },
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
          json: {...reservation, waitUntilMidnight, retry},
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
