import {
  BookingMethod,
  CarType,
  MemberType,
  SeatType,
  Station,
} from '@prisma/client';

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

export const stationOptions = [
  {value: Station.NanGang, label: '南港'},
  {value: Station.TaiPei, label: '台北'},
  {value: Station.BanQiao, label: '板橋'},
  {value: Station.TaoYuan, label: '桃園'},
  {value: Station.XinZhu, label: '新竹'},
  {value: Station.MiaoLi, label: '苗栗'},
  {value: Station.TaiZhong, label: '台中'},
  {value: Station.ZhangHua, label: '彰化'},
  {value: Station.YunLin, label: '雲林'},
  {value: Station.JiaYi, label: '嘉義'},
  {value: Station.TaiNan, label: '台南'},
  {value: Station.ZuoYing, label: '左營'},
] as const;

export const carTypes = [CarType.Standard, CarType.Business] as const;
export const carTypeOptions = [
  {value: CarType.Standard, label: '標準車廂'},
  {value: CarType.Business, label: '商務車廂'},
] as const;
export const bookingMethods = [
  BookingMethod.time,
  BookingMethod.trainNo,
] as const;
export const bookingMethodOptions = [
  {value: BookingMethod.time, label: '選擇時間'},
  {value: BookingMethod.trainNo, label: '輸入車次'},
] as const;

export const seatTypes = [
  SeatType.NoRequired,
  SeatType.WindowSeat,
  SeatType.AisleSeat,
] as const;

export const seatTypeOptions = [
  {value: SeatType.NoRequired, label: '無座位偏好'},
  {value: SeatType.WindowSeat, label: '靠窗優先'},
  {value: SeatType.AisleSeat, label: '走道優先'},
];

export const memberTypes = [MemberType.NotMember, MemberType.Member] as const;
export const memberOptions = [
  {value: MemberType.NotMember, label: '否'},
  {value: MemberType.Member, label: '是'},
] as const;

export const minTime = new Date('2023-01-01T06:00');
export const maxTime = new Date('2023-01-01T23:59');

export const ticketOptions = [
  {value: '0', label: '0'},
  {value: '1', label: '1'},
  {value: '2', label: '2'},
  {value: '3', label: '3'},
  {value: '4', label: '4'},
  {value: '5', label: '5'},
  {value: '6', label: '6'},
  {value: '7', label: '7'},
  {value: '8', label: '8'},
  {value: '9', label: '9'},
  {value: '10', label: '10'},
] as const;
