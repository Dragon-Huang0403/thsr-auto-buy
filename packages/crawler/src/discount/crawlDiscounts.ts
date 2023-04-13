import {got} from 'got';

import {handleDiscountDetail, handleRepeatedDiscounts} from './utils/helpers';
import {
  getDiscountDetails,
  getTrainTableUrls,
  getTypeUrls,
} from './utils/steps';

export async function crawlDiscounts() {
  const client = got.extend({});
  const typeUrls = await getTypeUrls(client);
  const trainTableUrls = (
    await Promise.all(
      typeUrls.map(typeUrl => getTrainTableUrls(client, typeUrl)),
    )
  ).flat();

  const discountDetails = (
    await Promise.all(
      trainTableUrls.map(trainTableUrl =>
        getDiscountDetails(client, trainTableUrl),
      ),
    )
  ).flat();

  const details = discountDetails.map(handleDiscountDetail).flat();
  const discounts = handleRepeatedDiscounts(details);

  return discounts;
}
