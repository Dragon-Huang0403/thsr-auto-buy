import {Got} from 'got';
import {parse} from 'node-html-parser';

import {BookingOptions} from '../types';
import {bookingPageUrl} from '../utils/constants';
import {parseTrainItems, throwIfHasError} from '../utils/parsers';
import {RequestFillers} from '../utils/requestFillers';

export async function getAvailableTrains(
  client: Got,
  request: GetAvailableTrainsRequest,
) {
  const {body: html} = await client.post(bookingPageUrl, {
    searchParams: request,
  });
  const page = parse(html);
  throwIfHasError(page);
  const trainItems = parseTrainItems(page);
  return trainItems;
}

type GetAvailableTrainsRequest = BookingOptions &
  RequestFillers['bookByTime']['getAvailableTrains'] & {
    'homeCaptcha:securityCode': string;
    bookingMethod: string;
  };
