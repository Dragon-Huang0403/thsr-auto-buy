import {Discount} from '@prisma/client';
import {addDays, addHours, format} from 'date-fns';
import {TdxApi} from 'tdx-api';
import {z} from 'zod';

import {prisma} from '~/server/prisma';

import {publicProcedure, router} from '../trpc';

const tdxApi = new TdxApi();

type TDiscount = Pick<Discount, 'minDiscountRatio' | 'type'>;
export type TrainWithDiscount = Awaited<
  ReturnType<typeof tdxApi.getRegularTimeTable>
>['data'][number] & {trainDiscounts: TDiscount[]};

export const timeRouter = router({
  search: publicProcedure
    .input(z.object({ticketDate: z.date()}))
    .query(async ({input}) => {
      const {ticketDate} = input;
      const gte = new Date(format(ticketDate, 'yyyy-MM-dd'));
      const lte = addHours(gte, 1);

      const {data: basicTimeTable} = await tdxApi.getRegularTimeTable();
      const discounts = await prisma.discount.findMany({
        where: {
          date: {gte, lte},
        },
        select: {
          date: true,
          type: true,
          trainNo: true,
          minDiscountRatio: true,
        },
      });
      const hash = {} as Record<string, TDiscount[]>;
      discounts.forEach(discount => {
        const {trainNo, minDiscountRatio, type} = discount;
        const trainDiscount = {minDiscountRatio, type};
        if (hash[trainNo]) {
          hash[trainNo]?.push(trainDiscount);
        } else {
          hash[trainNo] = [trainDiscount];
        }
      });

      const trainItems = basicTimeTable.map(_trainInfo => {
        const trainInfo = _trainInfo as TrainWithDiscount;
        trainInfo.trainDiscounts = [];
        const trainNo = parseInt(
          trainInfo.GeneralTimetable.GeneralTrainInfo.TrainNo,
        );
        const trainDiscount = hash[trainNo];
        trainInfo.trainDiscounts = trainDiscount ?? [];
        return trainInfo;
      });
      return trainItems;
    }),
  minReservingDate: publicProcedure.query(async () => {
    const {data: dates} = await tdxApi.getAvailableDates();
    const endDate = new Date(dates.EndDate);
    const minDate = addDays(endDate, 1);
    return minDate;
  }),
});
