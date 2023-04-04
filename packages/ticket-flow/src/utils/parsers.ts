import {HTMLElement} from 'node-html-parser';
import {z} from 'zod';

import {baseUrl} from './constants';
import {objectKeys} from './helper';
import {
  bookingMethodsSchema,
  memberValuesSchema,
  ticketResultSchema,
  trainItemSchema,
} from './schema';

export function throwIfHasError(page: HTMLElement) {
  const hasCookiesExpiredError = page.querySelector('.error-card.unknown');
  if (hasCookiesExpiredError) {
    throw new Error('Cookies expired');
  }

  const hasServerInternalError = page.querySelector(
    '.error-card .error-content',
  );
  if (hasServerInternalError) {
    throw new Error('THSR having internal server error');
  }

  const errorElements = page.querySelectorAll('span.feedbackPanelERROR');
  if (errorElements.length === 0) {
    return;
  }
  const errorMessages = errorElements
    .map(element => element.textContent.trim())
    .join(', ');

  const isCaptchaSolvedWrongError = errorMessages.includes('檢測碼輸入錯誤');
  if (isCaptchaSolvedWrongError) {
    throw new Error('Solving captcha wrong');
  }
  throw new Error(errorMessages);
}

export function parseBookingMethods(page: HTMLElement) {
  const searchByTimeElement = page.querySelector(
    '[data-target=search-by-time]',
  );
  const searchByTrainNoElement = page.querySelector(
    '[data-target=search-by-trainNo]',
  );
  const bookingMethods = {
    time: searchByTimeElement?.getAttribute('value'),
    trainNo: searchByTrainNoElement?.getAttribute('value'),
  };
  const result = bookingMethodsSchema.safeParse(bookingMethods);
  if (!result.success) {
    throw new Error('Parse booking methods failed');
  }
  return result.data;
}

export function parseCaptchaImageUrl(page: HTMLElement) {
  const imageElement = page.getElementById(
    'BookingS1Form_homeCaptcha_passCode',
  );
  const imagePathname = imageElement?.getAttribute('src');
  if (!imagePathname) {
    throw new Error('Parse captcha image URL failed');
  }
  const url = new URL(imagePathname, baseUrl);
  return url;
}

export function parseTrainItems(page: HTMLElement) {
  const trainItemElements = page.querySelectorAll('.result-item input');
  const trainItems = trainItemElements.map(element => ({
    value: element.getAttribute('value'),
    duration: element.getAttribute('queryestimatedtime'),
    departureTime: element.getAttribute('querydeparture'),
    arrivalTime: element.getAttribute('queryarrival'),
    trainNo: element.getAttribute('querycode'),
  }));
  const result = z.array(trainItemSchema).nonempty().safeParse(trainItems);
  if (!result.success) {
    throw new Error('Parse train items Failed');
  }
  return result.data;
}

export function parseMemberValues(page: HTMLElement) {
  const elements = page.querySelectorAll('.membership label');
  const memberValues = ['非高鐵會員', '高鐵會員 TGo 帳號', '企業會員統編'].map(
    text => {
      const targetElement = elements.find(ele =>
        ele.textContent.includes(text),
      );
      const value = targetElement
        ?.querySelector('input')
        ?.getAttribute('value');

      return value;
    },
  );
  const data = {
    NotMember: memberValues[0],
    Member: memberValues[1],
    Business: memberValues[2],
  };

  const result = memberValuesSchema.safeParse(data);

  if (!result.success) {
    throw new Error('Parse member values failed');
  }
  return result.data;
}

const ticketResultQueries = {
  ticketId: '.pnr-code span',
  trainNo: '#setTrainCode0',
  departureTime: '.departure-time span',
  departureStation: '.departure-stn span',
  arrivalTime: '.arrival-time span',
  arrivalStation: '.arrival-stn span',
  totalPrice: '#setTrainTotalPriceValue',
  date: '.date span',
  duration: '#InfoEstimatedTime0',
} as const;

export function parseTicketResult(page: HTMLElement) {
  const ticketResult = Object.fromEntries(
    objectKeys(ticketResultQueries).map(key => {
      const query = ticketResultQueries[key];
      const value = page.querySelector(query)?.textContent.trim();
      return [key, value];
    }),
  );
  const result = ticketResultSchema.safeParse(ticketResult);

  if (!result.success) {
    throw new Error('Parse ticket result failed');
  }
  return result.data;
}
