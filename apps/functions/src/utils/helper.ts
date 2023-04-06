/* eslint-disable turbo/no-undeclared-env-vars */

import database from 'database';
import {formatInTimeZone} from 'date-fns-tz';
import * as functions from 'firebase-functions';
import ticketFlow from 'ticket-flow';

import {asiaEast, asiaTaiPei} from './constants';
import {ticketFlowRequestSchema} from './schema';

type PrismaClient = database.PrismaClient;
const {PrismaClient, Prisma} = database;

export function getAsiaTaiPeiDate() {
  const now = new Date();
  const dateInTaiPei = formatInTimeZone(now, asiaTaiPei, 'yyyy-MM-dd');
  return new Date(dateInTaiPei);
}

export function getBookTicketUrl() {
  const bookTicketFunctionName = 'bookTicket';
  const projectName = process.env.GCLOUD_PROJECT ?? '';
  const bookFunctionUrl =
    process.env.FUNCTIONS_EMULATOR === 'true'
      ? `http://127.0.0.1:5001/${projectName}/${asiaEast}/${bookTicketFunctionName}`
      : `https://${asiaEast}-${projectName}.cloudfunctions.net/${bookTicketFunctionName}`;

  return bookFunctionUrl;
}

export async function handleTicketFlow(
  request: Zod.infer<typeof ticketFlowRequestSchema>,
  prisma: PrismaClient,
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
    // TODO: Handle race conditions
    /**
     * Currently it will not happen due to retryMaxAgeMs < timeoutSeconds
     * And period of calling to booking ticket is same as timeoutSeconds
     */
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return;
    }
    throw error;
  }
}

async function sleep(delayMs: number) {
  return new Promise(res => {
    setTimeout(res, delayMs);
  });
}

type RetryOptions = {
  delayMs: number;
  retryMaxAgeMs: number;
  startTime: number;
};

export async function retryIfThrow(
  fn: () => Promise<unknown>,
  options: RetryOptions,
) {
  const {delayMs, startTime, retryMaxAgeMs} = options;
  try {
    await fn();
  } catch {
    const retryAgeMs = Date.now() - startTime;
    if (retryAgeMs >= retryMaxAgeMs) {
      return;
    }
    await sleep(delayMs);
    await retryIfThrow(fn, options);
  }
}

export async function withPrisma(fn: (prisma: PrismaClient) => Promise<void>) {
  const prisma = new PrismaClient();
  await fn(prisma);
  await prisma.$disconnect();
}

export function shouldRetry({
  retryMaxAgeMs,
  startTime,
}: {
  retryMaxAgeMs: number;
  startTime: number;
}) {
  const retryAgeMs = Date.now() - startTime;
  return retryAgeMs < retryMaxAgeMs;
}
