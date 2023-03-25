import {got} from 'got';

import {getSpecialDayDetails, getSpecialDayUrl} from './utils/steps';

export async function crawlSpecialDays() {
  const client = got.extend({});
  const specialDayUrl = await getSpecialDayUrl(client);
  const specialDayDetails = await getSpecialDayDetails(client, specialDayUrl);
  return specialDayDetails;
}
