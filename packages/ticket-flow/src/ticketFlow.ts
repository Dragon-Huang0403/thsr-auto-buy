import {bookByTimeFlow} from './bookByTimeFlow';
import {bookByTrainNoFlow} from './bookByTrainNoFlow';
import {visitBookingPage} from './steps';
import {TicketFlowRequest} from './types';
import {captchaSolver} from './utils/captchaSolver';
import {createClient} from './utils/client';

export async function ticketFlow(request: TicketFlowRequest) {
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
}
