import {bookByTimeFlow} from './bookByTimeFlow';
import {bookByTrainNoFlow} from './bookByTrainNoFlow';
import {visitBookingPage} from './steps';
import {TicketFlowRequest, TicketResult} from './types';
import {captchaSolver} from './utils/captchaSolver';
import {createClient} from './utils/client';
import {
  isCaptchaError,
  isSentTooEarlyError,
  waitingUntilMidnight,
} from './utils/helper';
import {TicketFlowError, TicketFlowErrorType} from './utils/ticketFlowError';

const defaultRetry = 8;
export async function ticketFlow(
  request: TicketFlowRequest,
  retry = defaultRetry,
): Promise<TicketResult> {
  try {
    const client = createClient();
    const {bookingMethods, captchaImageUrl} = await visitBookingPage(client);
    const captchaResult = await captchaSolver(client, captchaImageUrl);
    const bookingMethod = bookingMethods[request.bookingMethod];

    const data = {
      client,
      request,
      bookingMethod,
      captchaResult,
    };

    if (request.waitUntilMidnight) {
      await waitingUntilMidnight();
    }

    if (request.bookingMethod === 'time') {
      const ticketResult = await bookByTimeFlow(data);

      return ticketResult;
    }

    const ticketResult = await bookByTrainNoFlow(data);
    return ticketResult;
  } catch (error) {
    if (retry > 0 && isCaptchaError(error)) {
      return ticketFlow(request, retry - 1);
    }

    if (
      retry === defaultRetry &&
      request.waitUntilMidnight &&
      isSentTooEarlyError(error)
    ) {
      return ticketFlow(request, retry - 1);
    }

    if (!(error instanceof TicketFlowError)) {
      throw new TicketFlowError(
        TicketFlowErrorType.unknown,
        (error as Error)?.message,
      );
    }
    throw error;
  }
}
