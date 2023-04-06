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

type StoreData = Omit<z.infer<typeof reservationSchema>, 'ticketDate'> & {
  ticketDate: Date | null;
};

type Store = {
  data: StoreData;
  updateStore: (values: Partial<StoreData>) => void;
};

const StoreContext = createContext({} as Store);

interface StoreProviderProps {
  children: ReactNode;
}

const defaultValues: StoreData = {
  startStation: Station.NanGang,
  endStation: Station.TaiPei,
  ticketDate: null,
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

export function StoreProvider({children}: StoreProviderProps) {
  const [store, setStore] = useState<StoreData>(defaultValues);

  const updateStore = (values: Partial<StoreData>) => {
    setStore(prev => ({...prev, ...values}));
  };

  return (
    <StoreContext.Provider value={{data: store, updateStore}}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
