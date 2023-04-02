import {
  BookingMethod,
  CarType,
  MemberType,
  SeatType,
  Station,
} from '@prisma/client';
import {createContext, ReactNode, useContext, useState} from 'react';
import {z} from 'zod';

import {reservationSchema} from './schema';
import {trpc} from './trpc';

type StoreData = z.infer<typeof reservationSchema>;

type Store = {
  data: StoreData;
  updateStore: (values: Partial<StoreData>) => void;
};

const StoreContext = createContext({} as Store);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({children}: StoreProviderProps) {
  const [store, setStore] = useState<StoreData>();

  const updateStore = (values: Partial<StoreData>) => {
    setStore(prev => prev && {...prev, ...values});
  };

  const shouldRender = !!store;

  trpc.time.minReservingDate.useQuery(undefined, {
    onSuccess: data => {
      const ticketDate = data.minDate;
      const defaultData = getDefaultValues(ticketDate);
      setStore(defaultData);
    },
    enabled: !shouldRender,
  });

  return (
    <StoreContext.Provider value={{data: store as StoreData, updateStore}}>
      {shouldRender && children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

function getDefaultValues(ticketDate: Date) {
  const defaultValues: z.infer<typeof reservationSchema> = {
    startStation: Station.NanGang,
    endStation: Station.TaiPei,
    ticketDate,
    bookingMethod: BookingMethod.time,
    trainNo: '',
    carType: CarType.Standard,
    seatType: SeatType.NoRequired,
    taiwanId: '',
    email: '',
    phone: '',
    tickets: {
      adultTicket: 1,
      childTicket: 0,
      disabledTicket: 0,
      elderTicket: 0,
      collegeTicket: 0,
    },
    memberType: MemberType.NotMember,
  };
  return defaultValues;
}
