import {Got} from 'got';
import {parse} from 'node-html-parser';

import {BookingOptions} from '../types';
import {bookingPageUrl} from '../utils/constants';
import {parseMemberValues, throwIfHasError} from '../utils/parsers';
import {RequestFillers} from '../utils/requestFillers';

export async function confirmTrain(
  client: Got,
  request: BookByTimeConfirmTrainRequest | BookByTrainNoConfirmTrainRequest,
) {
  const {body: html} = await client.post(bookingPageUrl, {
    searchParams: request,
  });
  const page = parse(html);
  throwIfHasError(page);
  const memberValues = parseMemberValues(page);
  return memberValues;
}

type BookByTimeConfirmTrainRequest =
  RequestFillers['bookByTime']['confirmTrain'] & {
    /**
     * TrainValue, get from page
     */
    'TrainQueryDataViewPanel:TrainGroup': string;
  };

type BookByTrainNoConfirmTrainRequest =
  RequestFillers['bookByTrainNo']['confirmTrain'] &
    BookingOptions & {
      'homeCaptcha:securityCode': string;
      bookingMethod: string;
    };
