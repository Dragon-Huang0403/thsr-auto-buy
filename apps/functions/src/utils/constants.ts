import database from 'database';

const {BookingMethod, CarType, MemberType, SeatType, Station} = database;

export const stations = [
  Station.NanGang,
  Station.TaiPei,
  Station.BanQiao,
  Station.TaoYuan,
  Station.XinZhu,
  Station.MiaoLi,
  Station.TaiZhong,
  Station.ZhangHua,
  Station.YunLin,
  Station.JiaYi,
  Station.TaiNan,
  Station.ZuoYing,
] as const;

export const carTypes = [CarType.Standard, CarType.Business] as const;

export const bookingMethods = [
  BookingMethod.time,
  BookingMethod.trainNo,
] as const;

export const seatTypes = [
  SeatType.NoRequired,
  SeatType.WindowSeat,
  SeatType.AisleSeat,
] as const;

export const memberTypes = [MemberType.NotMember, MemberType.Member] as const;

export const asiaEast = 'asia-east1';

export const secrets = {
  DATABASE_URL: 'DATABASE_URL',
  DATABASE_DIRECT_URL: 'DATABASE_DIRECT_URL',
  CAPTCHA_SOLVER: 'CAPTCHA_SOLVER',
  CAPTCHA_KEY: 'CAPTCHA_KEY',
} as const;

export const asiaTaiPei = 'Asia/Taipei';
