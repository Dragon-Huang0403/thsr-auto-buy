import {Got} from 'got';
import {parse} from 'node-html-parser';

import {bookingPageUrl} from '../utils/constants';
import {
  parseBookingMethods,
  parseCaptchaImageUrl,
  throwIfHasError,
} from '../utils/parsers';

export async function visitBookingPage(client: Got) {
  const {body: html} = await client.get(bookingPageUrl);
  const page = parse(html);
  throwIfHasError(page);
  const bookingMethods = parseBookingMethods(page);
  const captchaImageUrl = parseCaptchaImageUrl(page);
  return {bookingMethods, captchaImageUrl};
}
