import {addDays, differenceInDays, format} from 'date-fns';

import {TableType} from './constants';
import {
  CrawledDiscount,
  CrawledDiscountWithTableType,
  DiscountDetail,
  DiscountType,
  RegularTrainItem,
  SpecialDayTrainItem,
} from './types';

export function notEmpty<TValue>(
  value: TValue | undefined | null,
): value is TValue {
  return value !== undefined && value !== null;
}

function handleRegularTrainItem(
  trainItem: RegularTrainItem,
  days: number,
  startDate: Date,
  type: DiscountType,
) {
  const {trainNo, details} = trainItem;
  const discounts = Array.from({length: days}, (_, i) => {
    const date = addDays(startDate, i);
    const day = parseInt(format(date, 'i')) - 1;
    const detail = details[day];
    return detail
      ? {
          minDiscountRatio: detail.minRatio,
          type,
          date,
          trainNo,
          tableType: TableType.regular,
        }
      : null;
  });
  return discounts;
}

function handleSpecialDayTrainItem(
  trainItem: SpecialDayTrainItem,
  type: DiscountType,
) {
  if (!trainItem || !trainItem.detail) {
    return null;
  }
  const {date, trainNo, detail} = trainItem;
  return {
    type,
    date,
    trainNo,
    minDiscountRatio: detail.minRatio,
    tableType: TableType.specialDays,
  };
}

export function handleDiscountDetail(
  discountDetail: DiscountDetail,
): CrawledDiscountWithTableType[] {
  const {startDate, endDate, discountType, trainItems} = discountDetail;
  const discounts = trainItems
    .map(trainItem => {
      if (trainItem.tableType === TableType.regular) {
        const days = differenceInDays(endDate, startDate) + 1;
        return handleRegularTrainItem(trainItem, days, startDate, discountType);
      }
      return handleSpecialDayTrainItem(trainItem, discountType);
    })
    .flat()
    .filter(notEmpty);

  return discounts;
}

export function handleRepeatedDiscounts(
  discounts: CrawledDiscountWithTableType[],
): CrawledDiscount[] {
  const hash: Record<string, CrawledDiscount> = {};
  discounts.forEach(data => {
    const {tableType, ...discount} = data;
    const key = `${discount.date}${discount.type}${discount.trainNo}`;
    if (key in hash && tableType === TableType.regular) {
      return;
    }
    hash[key] = discount;
  });
  return Object.values(hash);
}
