import {bookByTimeFlow} from './bookByTimeFlow';
import {bookByTrainNoFlow} from './bookByTrainNoFlow';
import {visitBookingPage} from './steps';
import {TicketFlowRequest, TicketResult} from './types';
import {captchaSolver} from './utils/captchaSolver';
import {createClient} from './utils/client';
import {isCaptchaError} from './utils/helper';

export async function ticketFlow(
  request: TicketFlowRequest,
  retry = 8,
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
    if (request.bookingMethod === 'time') {
      const ticketResult = await bookByTimeFlow(data);

      return ticketResult;
    }

    const ticketResult = await bookByTrainNoFlow(data);
    return ticketResult;
  } catch (e) {
    if (retry > 0 && isCaptchaError(e)) {
      return ticketFlow(request, retry - 1);
    }
    throw e;
  }
}
