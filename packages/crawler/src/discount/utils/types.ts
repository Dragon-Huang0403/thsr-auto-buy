import {z} from 'zod';

import {DISCOUNTS_TEXTS, TableType} from './constants';
import {regularTrainItemSchema, specialDayTrainItemSchema} from './schema';

export type DiscountType = keyof typeof DISCOUNTS_TEXTS;
export type DiscountUrl = {
  discountType: DiscountType;
  url: URL;
};

export type RegularTrainItem = z.infer<typeof regularTrainItemSchema>;
export type SpecialDayTrainItem = z.infer<typeof specialDayTrainItemSchema>;
export type TrainItem = RegularTrainItem | SpecialDayTrainItem;

export type DiscountDetail = {
  startDate: Date;
  endDate: Date;
  trainItems: TrainItem[];
  tableType: TableType;
  discountType: DiscountType;
};

export type CrawledDiscount = {
  type: DiscountType;
  date: Date;
  trainNo: number;
  minDiscountRatio: number;
};
