import {HTMLElement} from 'node-html-parser';

import {specialDaySchema} from './schema';

export function parseYear(page: HTMLElement) {
  const yearElement = page.querySelector('#section h3');
  const year = yearElement?.textContent.match(/\d{4}/)?.[0];
  if (!year) {
    throw new Error('Parse Year Failed');
  }
  return year;
}

export function parseSpecialDayDetail(
  element: HTMLElement,
  defaultYear: string,
) {
  const rowElements = element.querySelectorAll('td');
  const name = rowElements[0]?.textContent.trim();
  const period = rowElements[1]?.textContent.match(
    /(\d{4}\/){0,1}\d{1,2}\/\d{1,2}/g,
  );

  const dates = period?.map(string => {
    const dateArr = string.split('/');
    if (dateArr.length === 2) {
      dateArr.unshift(defaultYear);
    }
    const dateString = dateArr.map(str => str.padStart(2, '0')).join('-');
    return dateString;
  });

  const startBookDay = rowElements[2]?.textContent
    .match(/\d{4}\/\d{1,2}\/\d{1,2}/)?.[0]
    .split('/')
    .map(str => str.padStart(2, '0'))
    .join('-');

  const data = {
    name,
    startDate: dates?.[0],
    endDate: dates?.[1],
    startBookDay,
  };

  return specialDaySchema.parse(data);
}
