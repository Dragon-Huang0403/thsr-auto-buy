import {getISODay, setDay, subDays} from 'date-fns';

import {earlyBookDay} from '~/utils/constants';

import {prisma} from './prisma';

export async function getBookDate(ticketDate: Date) {
  const specialDays = await prisma.specialBookDay.findMany({});

  const specialDay = specialDays.find(
    day => day.startDate >= ticketDate && day.endDate <= ticketDate,
  );
  if (specialDay) {
    return specialDay.startBookDay;
  }

  let date = new Date(ticketDate.toISOString().slice(0, 10));

  // Between Saturday to Sunday, set To Friday
  if (getISODay(ticketDate) >= 6) {
    date = setDay(ticketDate, 5, {weekStartsOn: 1});
  }

  const bookDate = subDays(date, earlyBookDay);

  return bookDate;
}
