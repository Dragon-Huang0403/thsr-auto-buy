import database from 'database';
import {formatInTimeZone} from 'date-fns-tz';

import {asiaEast, asiaTaiPei} from './constants';
const {Prisma} = database;

export function getAsiaTaiPeiDate() {
  const now = new Date();
  const dateInTaiPei = formatInTimeZone(now, asiaTaiPei, 'yyyy-MM-dd');
  return new Date(dateInTaiPei);
}

export function getFunctionUrl(functionName: string) {
  const projectName = process.env.GCLOUD_PROJECT ?? '';
  const bookFunctionUrl =
    process.env.FUNCTIONS_EMULATOR === 'true'
      ? `http://127.0.0.1:5001/${projectName}/${asiaEast}/${functionName}`
      : `https://${asiaEast}-${projectName}.cloudfunctions.net/${functionName}`;

  return bookFunctionUrl;
}

/**
 *
 * @param delayMs time in milliseconds
 */
export async function sleep(delayMs: number) {
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

export async function waitingUntilSecond(second: number) {
  while (new Date().getSeconds() < second) {
    await sleep(500);
  }
}

export function isDoubleBookingError(error: Error) {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}
