import type {Got} from 'got';
import {parse} from 'node-html-parser';

import {objectKeys} from '../../utils/helpers';
import {DISCOUNTS_TEXTS, TableType, WEBSITE} from './constants';
import {
  parseRegularTrainItems,
  parseSpecialDayTrainItems,
  parseTableHeader,
  parseTrainTableDate,
} from './parser';
import {DiscountDetail, DiscountUrl} from './types';

export async function getTypeUrls(client: Got) {
  const {body: html} = await client.get(WEBSITE);
  const page = parse(html);
  const linkElements = page.querySelectorAll('li a');
  const typeUrls = objectKeys(DISCOUNTS_TEXTS).map(discountType => {
    const urlElement = linkElements.find(
      ele => ele.textContent.trim() === DISCOUNTS_TEXTS.earlyBird,
    );
    const pathname = urlElement?.getAttribute('href');
    if (!pathname) {
      throw new Error('Get Discount Url Failed');
    }
    const url = new URL(pathname, WEBSITE);
    return {discountType, url};
  });
  return typeUrls;
}

export async function getTrainTableUrls(client: Got, typeUrl: DiscountUrl) {
  const {body: html} = await client.get(typeUrl.url);
  const page = parse(html);
  const linkElements = page.querySelectorAll('.btn_group a');
  const trainTableUrls = linkElements.map(element => {
    const pathname = element?.getAttribute('href');
    if (!pathname) {
      throw new Error('Get Train Table Urls Failed');
    }
    const url = new URL(pathname, WEBSITE);
    return {discountType: typeUrl.discountType, url};
  });
  return trainTableUrls;
}

export async function getDiscountDetails(
  client: Got,
  trainTableUrl: DiscountUrl,
): Promise<DiscountDetail> {
  const {discountType, url} = trainTableUrl;
  const {body: html} = await client.get(url);
  const page = parse(html);
  const {startDate, endDate} = parseTrainTableDate(page);

  const tableType = parseTableHeader(page);

  let trainItems;
  if (tableType === TableType.regular) {
    trainItems = parseRegularTrainItems(page);
  } else {
    trainItems = parseSpecialDayTrainItems(page);
  }

  return {
    startDate,
    endDate,
    trainItems,
    tableType,
    discountType,
  };
}
