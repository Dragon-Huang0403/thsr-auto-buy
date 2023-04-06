export const baseUrl = 'https://irs.thsrc.com.tw';

export const bookingPageUrl = new URL('/IMINT/', baseUrl);
export const timeZone = 'Asia/Taipei';

export const stationValues = {
  NanGang: '1',
  TaiPei: '2',
  BanQiao: '3',
  TaoYuan: '4',
  XinZhu: '5',
  MiaoLi: '6',
  TaiZhong: '7',
  ZhangHua: '8',
  YunLin: '9',
  JiaYi: '10',
  TaiNan: '11',
  ZuoYing: '12',
} as const;

export const timeOptions = [
  {
    value: '600A',
    time: 600,
  },
  {
    value: '630A',
    time: 630,
  },
  {
    value: '700A',
    time: 700,
  },
  {
    value: '730A',
    time: 730,
  },
  {
    value: '800A',
    time: 800,
  },
  {
    value: '830A',
    time: 830,
  },
  {
    value: '900A',
    time: 900,
  },
  {
    value: '930A',
    time: 930,
  },
  {
    value: '1000A',
    time: 1000,
  },
  {
    value: '1030A',
    time: 1030,
  },
  {
    value: '1100A',
    time: 1100,
  },
  {
    value: '1130A',
    time: 1130,
  },
  {
    value: '1200N',
    time: 1200,
  },
  {
    value: '1230P',
    time: 1230,
  },
  {
    value: '100P',
    time: 1300,
  },
  {
    value: '130P',
    time: 1330,
  },
  {
    value: '200P',
    time: 1400,
  },
  {
    value: '230P',
    time: 1430,
  },
  {
    value: '300P',
    time: 1500,
  },
  {
    value: '330P',
    time: 1530,
  },
  {
    value: '400P',
    time: 1600,
  },
  {
    value: '430P',
    time: 1630,
  },
  {
    value: '500P',
    time: 1700,
  },
  {
    value: '530P',
    time: 1730,
  },
  {
    value: '600P',
    time: 1800,
  },
  {
    value: '630P',
    time: 1830,
  },
  {
    value: '700P',
    time: 1900,
  },
  {
    value: '730P',
    time: 1930,
  },
  {
    value: '800P',
    time: 2000,
  },
  {
    value: '830P',
    time: 2030,
  },
  {
    value: '900P',
    time: 2100,
  },
  {
    value: '930P',
    time: 2130,
  },
  {
    value: '1000P',
    time: 2200,
  },
  {
    value: '1030P',
    time: 2230,
  },
  {
    value: '1100P',
    time: 2300,
  },
  {
    value: '1130P',
    time: 2330,
  },
] as const;

export const carTypeValues = {
  Standard: '0',
  Business: '1',
} as const;

export const seatTypeValues = {
  NoRequired: '0',
  WindowSeat: '1',
  AisleSeat: '2',
} as const;

export const tripTypeValues = {
  single: '0',
  round: '1',
} as const;
