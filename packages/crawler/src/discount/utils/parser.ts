import {HTMLElement} from 'node-html-parser';
import {z} from 'zod';

import {TableType, WEEK_DAYS_IN_CHINESE} from './constants';
import {
  regularTrainItemSchema,
  specialDayTrainItemSchema,
  trainTableDateSchema,
} from './schema';

export function parseTrainTableDate(page: HTMLElement) {
  const descriptionElement = page.querySelector('.header .container');
  const description = descriptionElement?.textContent.trim();
  const trainTablePeriod = description?.match(
    /(\d{4}\/){0,1}\d{1,2}\/\d{1,2}/g,
  );
  const year = trainTablePeriod?.[0]?.split('/')[0];
  let [startDate, endDate] =
    trainTablePeriod?.map(dateString =>
      dateString
        .split('/')
        .map(str => str.padStart(2, '0'))
        .join('-'),
    ) ?? [];

  const endDateHasNoYear = endDate?.length === 5;
  if (endDateHasNoYear) {
    endDate = `${year}-${endDate}`;
  }

  const result = trainTableDateSchema.safeParse({startDate, endDate});
  if (!result.success) {
    throw new Error('Parse Train Table Date Failed');
  }

  return result.data;
}

export function parseTableHeader(page: HTMLElement) {
  const headerElements = page.querySelectorAll('.table-head span');
  /**
   * First Two are trainId and departure time
   */
  const timeHeaderElements = headerElements.slice(2);
  const headers = timeHeaderElements.map(element => element.textContent.trim());
  const isRegularTimeTable = headers.every(
    (header, i) => header === WEEK_DAYS_IN_CHINESE[i],
  );
  if (isRegularTimeTable) {
    return TableType.regular;
  }
  return TableType.specialDays;
}

export function parseSpecialDayTrainItems(page: HTMLElement) {
  const year =
    page.querySelector('.header')?.textContent.match(/\d{4}/)?.[0] ?? '';
  const trainItemElements = page.querySelectorAll('tr i');
  const trainItems = trainItemElements.map(element => {
    const descriptions = element.getAttribute('aria-label')?.split(' ');

    const trainNo = parseInt(descriptions?.[1]?.match(/\d+/)?.[0] ?? '');

    const monthAndDay =
      descriptions?.[0]?.split('/').map(str => str.padStart(2, '0')) ?? [];
    const date = [year, ...monthAndDay].join('-');

    const discountRatios = descriptions?.[3]
      ?.match(/\d{1,2}/g)
      ?.map(str => parseInt(str.padEnd(2, '0')));
    if (!discountRatios || !(discountRatios?.length >= 1)) {
      return {date, trainNo, detail: null};
    }

    const minRatio = Math.min(...discountRatios);

    const detail = {minRatio, discountRatios};
    return {date, trainNo, detail};
  });
  return z.array(specialDayTrainItemSchema).nonempty().parse(trainItems);
}

export function parseRegularTrainItems(page: HTMLElement) {
  const headerElements = page.querySelectorAll('.table-head span').slice(2);
  const isRegularTable = headerElements.every((element, i) => {
    const weekDay = element.textContent.trim();
    return weekDay === WEEK_DAYS_IN_CHINESE[i];
  });
  if (!isRegularTable) {
    throw new Error("It's Not Regular Table");
  }

  const rowElements = page.querySelectorAll('tr');

  const trainItems = rowElements.map(element => {
    const columnElements = element.querySelectorAll('td');
    const trainNo = parseInt(columnElements[0]?.textContent.trim() ?? '');

    const weekDayElements = columnElements.slice(2);
    const details = weekDayElements.map(ele => {
      const descriptions = ele
        .querySelector('i')
        ?.getAttribute('aria-label')
        ?.split(' ');

      const discountRatios = descriptions?.[3]
        ?.match(/\d{1,2}/g)
        ?.map(str => parseInt(str.padEnd(2, '0')));
      if (!discountRatios || !(discountRatios?.length >= 1)) {
        return null;
      }
      const minRatio = Math.min(...discountRatios);
      return {minRatio, discountRatios};
    });
    return {trainNo, details};
  });

  const result = z
    .array(regularTrainItemSchema)
    .nonempty()
    .safeParse(trainItems);

  if (!result.success) {
    throw new Error('Parse Train Items Failed');
  }
  return result.data;
}
