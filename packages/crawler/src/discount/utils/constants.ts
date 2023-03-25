export const WEBSITE = 'https://www.thsrc.com.tw/';

export const DISCOUNTS_TEXTS = {
  earlyBird: '早鳥優惠',
  college: '大學生優惠',
} as const;

export const ISO_WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const WEEK_DAYS_IN_CHINESE = [
  '週一',
  '週二',
  '週三',
  '週四',
  '週五',
  '週六',
  '週日',
] as const;

export const TableType = {
  regular: 'regular',
  specialDays: 'specialDays',
} as const;

export type TableType = (typeof TableType)[keyof typeof TableType];
