import {Got} from 'got';
import parse from 'node-html-parser';

import {WEBSITE} from './constants';
import {parseSpecialDayDetail, parseYear} from './parser';

export async function getSpecialDayUrl(client: Got) {
  const {body: html} = await client.get(WEBSITE);
  const page = parse(html);
  const linkElements = page.querySelectorAll('a');
  const pathname = linkElements
    .find(element => element.textContent.includes('疏運日程表'))
    ?.getAttribute('href');

  if (!pathname) {
    throw new Error('Get Special Day Url Failed');
  }
  const url = new URL(pathname, WEBSITE);
  return url;
}

export async function getSpecialDayDetails(client: Got, url: URL) {
  const {body: html} = await client.get(url);
  const page = parse(html);

  const year = parseYear(page);

  const specialDayElements = page.querySelectorAll('tbody tr');
  const specialDayDetails = specialDayElements.map(element =>
    parseSpecialDayDetail(element, year),
  );

  return specialDayDetails;
}
