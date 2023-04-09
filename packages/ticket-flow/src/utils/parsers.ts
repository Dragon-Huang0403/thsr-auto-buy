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
import {TicketFlowError, TicketFlowErrorType} from './ticketFlowError';

export function throwIfHasError(page: HTMLElement) {
  const hasCookiesExpiredError = page.querySelector('.error-card.unknown');
  if (hasCookiesExpiredError) {
    throw new TicketFlowError(TicketFlowErrorType.cookiesExpired);
  }

  const hasServerInternalError = page.querySelector(
    '.error-card .error-content',
  );
  if (hasServerInternalError) {
    throw new TicketFlowError(TicketFlowErrorType.thsrServerError);
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
    throw new TicketFlowError(TicketFlowErrorType.solvingCaptchaWrong);
  }
  const isSoldOut = errorMessages.includes('座位已額滿');
  if (isSoldOut) {
    throw new TicketFlowError(TicketFlowErrorType.soldOut);
  }

  const isBadRequest = [
    '去程您所選擇的日期超過目前開放預訂之日期',
    '請輸入正確車次號碼',
    'TGo帳號失效或不存在',
  ].some(str => errorMessages.includes(str));
  if (isBadRequest) {
    throw new TicketFlowError(TicketFlowErrorType.badRequest, errorMessages);
  }

  throw new TicketFlowError(TicketFlowErrorType.unknown, errorMessages);
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
    throw new TicketFlowError(
      TicketFlowErrorType.parsePageFailed,
      'Parsing booking methods failed',
    );
  }
  return result.data;
}

export function parseCaptchaImageUrl(page: HTMLElement) {
  const imageElement = page.getElementById(
    'BookingS1Form_homeCaptcha_passCode',
  );
  const imagePathname = imageElement?.getAttribute('src');
  if (!imagePathname) {
    throw new TicketFlowError(
      TicketFlowErrorType.parsePageFailed,
      'Parsing captcha image URL failed',
    );
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
    throw new TicketFlowError(
      TicketFlowErrorType.parsePageFailed,
      'Parsing train items Failed',
    );
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
    throw new TicketFlowError(
      TicketFlowErrorType.parsePageFailed,
      'Parsing member values failed',
    );
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
    throw new TicketFlowError(
      TicketFlowErrorType.parsePageFailed,
      'Parsing ticket result failed',
    );
  }
  return result.data;
}
