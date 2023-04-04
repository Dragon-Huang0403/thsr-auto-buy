import {differenceInMinutes, format} from 'date-fns';

import {TrainWithDiscount} from '~/server/routers/time';

import {stationObjects} from './constants';
import type {TimeSearchParams} from './schema';

export function sumAll(numbers: number[]) {
  let result = 0;
  numbers.forEach(number => {
    result += number;
  });
  return result;
}

export function notEmpty<TValue>(
  value: TValue | undefined | null,
): value is TValue {
  return value !== undefined && value !== null;
}
export function padTo2Digit(num: number) {
  return num.toString().padStart(2, '0');
}

export function getDirection({
  startStation,
  endStation,
}: Pick<TimeSearchParams, 'startStation' | 'endStation'>) {
  const startStationValue = stationObjects[startStation].value;
  const endStationValue = stationObjects[endStation].value;
  const goNorth = parseInt(startStationValue) > parseInt(endStationValue);
  const direction = goNorth ? 1 : 0;
  return direction;
}

export function handleTrainItem(
  trainItems: TrainWithDiscount[],
  {startStation, endStation, ticketDate}: TimeSearchParams,
) {
  const direction = getDirection({startStation, endStation});

  const result = trainItems
    .map(trainItem => {
      const general = trainItem.GeneralTimetable;
      const isSameDirection = general.GeneralTrainInfo.Direction === direction;

      const startStop = general.StopTimes.find(
        stop => stop.StationID === stationObjects[startStation].id,
      );
      const endStop = general.StopTimes.find(
        stop => stop.StationID === stationObjects[endStation].id,
      );
      if (!isSameDirection || !endStop || !startStop) {
        return null;
      }
      const date = format(ticketDate, 'yyyy-MM-dd');
      const departureTime = new Date(`${date} ${startStop.DepartureTime}`);
      const arrivalTime = new Date(`${date} ${endStop.ArrivalTime}`);

      const diffMinutes = differenceInMinutes(arrivalTime, departureTime);

      const minutes = diffMinutes % 60;
      const hours = (diffMinutes - minutes) / 60;
      const duration = `${padTo2Digit(hours)}:${padTo2Digit(minutes)}`;
      return {
        trainInfo: general.GeneralTrainInfo,
        serviceDay: general.ServiceDay,
        stopTimes: general.StopTimes,
        duration,
        startStop,
        endStop,
        discounts: trainItem.trainDiscounts,
        departureTime,
        arrivalTime,
      };
    })
    .filter(notEmpty)
    .sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime());

  return result;
}

export function objectKeys<
  T extends Record<string, unknown>,
  Key extends keyof T,
>(object: T) {
  const keys = Object.keys(object) as Key[];
  return keys;
}
