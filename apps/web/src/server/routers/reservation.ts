/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import {Prisma} from '@prisma/client';

import {prisma} from '~/server/prisma';
import {reservationSchema} from '~/utils/schema';

import {publicProcedure, router} from '../trpc';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultReservationSelect = Prisma.validator<Prisma.ReservationSelect>()({
  id: true,
  startStation: true,
  endStation: true,
  ticketDate: true,
  bookDate: true,
  bookingMethod: true,
  trainNo: true,
  carType: true,
  seatType: true,
  taiwanId: true,
  email: true,
  phone: true,
  adultTicket: true,
  collegeTicket: true,
  memberType: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
});

export const reservationRouter = router({
  add: publicProcedure.input(reservationSchema).mutation(async ({input}) => {
    const {tickets, ...reservation} = input;
    const bookDate = new Date();

    const data = {
      ...tickets,
      ...reservation,
      trainNo: parseInt(reservation.trainNo) || 0,
      bookDate,
    };
    return await prisma.reservation.create({
      data,
      select: defaultReservationSelect,
    });
  }),
});
