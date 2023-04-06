import {z} from 'zod';

import {
  carTypeValues,
  seatTypeValues,
  stationValues,
  timeOptions,
  tripTypeValues,
} from './utils/constants';
import {
  memberValuesSchema,
  ticketResultSchema,
  trainItemSchema,
} from './utils/schema';

export type TicketResult = z.infer<typeof ticketResultSchema>;
type StationValues = typeof stationValues;
type Station = keyof StationValues;
type StationValue = StationValues[Station];

type BookingMethod = 'trainNo' | 'time';

type CarTypeValues = typeof carTypeValues;
type CarType = keyof CarTypeValues;
/**
 * 0: Standard Car
 * 1: Business Car
 */
type CarTypeValue = CarTypeValues[CarType];

type SeatTypeValues = typeof seatTypeValues;
type SeatType = keyof SeatTypeValues;
/**
 * 0: No Required
 * 1: Window Seat
 * 2: Aisle Seat
 */
type SeatTypeValue = SeatTypeValues[SeatType];

export type MemberType = 'NotMember' | 'Member' | 'Business';

type TripTypeValues = typeof tripTypeValues;
type TripType = keyof TripTypeValues;
/**
 * 0: Single Trip
 * 1: Round Trip
 */
type TripTypeValue = TripTypeValues[TripType];

/**
 *  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
 */
type TicketAmount = number;

type ToTimeTableValue = (typeof timeOptions)[number]['value'];

export interface TicketFlowRequest {
  startStation: Station;
  endStation: Station;
  ticketDate: Date;
  bookingMethod: BookingMethod;
  trainNo: number;
  carType: CarType;
  seatType: SeatType;
  taiwanId: string;
  email: string;
  phone: string;
  adultTicket: number;
  childTicket: number;
  disabledTicket: number;
  elderTicket: number;
  collegeTicket: number;
  memberType: MemberType;
  waitUntilMidnight?: boolean;
  [key: string]: unknown;
}

export type BookingOptions = {
  selectStartStation: StationValue;
  selectDestinationStation: StationValue;
  /**
   * @pattern "yyyy/mm/dd"
   */
  toTimeInputField: string;
  'trainCon:trainRadioGroup': CarTypeValue;
  'seatCon:seatRadioGroup': SeatTypeValue;
  'tripCon:typesoftrip': TripTypeValue;
  /**
   * Adult Tickets
   */
  'ticketPanel:rows:0:ticketAmount': `${TicketAmount}F`;
  /**
   * Child Tickets (6-11)
   */
  'ticketPanel:rows:1:ticketAmount': `${TicketAmount}H`;
  /**
   * Disabled ticket (Taiwan only)
   */
  'ticketPanel:rows:2:ticketAmount': `${TicketAmount}W`;
  /**
   * Elder ticket (Taiwan only)
   */
  'ticketPanel:rows:3:ticketAmount': `${TicketAmount}E`;
  /**
   * College student ticket (Taiwan only)
   */
  'ticketPanel:rows:4:ticketAmount': `${TicketAmount}P`;
  toTimeTable: ToTimeTableValue | '';
  toTrainIDInputField: string;
};

export type BuyerInfo = {
  dummyId: string;
  dummyPhone: string;
  email: string;
};

export type TrainItem = z.infer<typeof trainItemSchema>;
export type MemberValues = z.infer<typeof memberValuesSchema>;
