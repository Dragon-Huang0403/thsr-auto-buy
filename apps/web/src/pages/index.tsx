import {zodResolver} from '@hookform/resolvers/zod';
import {Button, styled, TextField, Typography} from '@mui/material';
import {DatePicker, TimePicker} from '@mui/x-date-pickers';
import {BookingMethod, CarType, MemberType, SeatType, Station} from 'database';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';

import {
  bookingMethodOptions,
  carTypeOptions,
  maxTime,
  memberOptions,
  minTime,
  seatTypeOptions,
  stationOptions,
  ticketOptions,
} from '~/utils/constants';
import {reservationSchema} from '~/utils/schema';

import Radios from '../components/Radios';
import Select from '../components/Select';
import {NextPageWithLayout} from './_app';

function getDefaultValues() {
  const now = new Date();
  now.setMinutes(0);
  const defaultValues: z.infer<typeof reservationSchema> = {
    startStation: Station.NanGang,
    endStation: Station.TaiPei,
    ticketDate: now,
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

const Form = styled('form')({});

const IndexPage: NextPageWithLayout = () => {
  const {control, formState, handleSubmit, watch, setError} = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = handleSubmit(data => {
    const isBookByTrainNo = data.bookingMethod === BookingMethod.trainNo;
    const isTrainNoAllDigit = /^\d{3,4}$/.test(data.trainNo);
    if (isBookByTrainNo && !isTrainNoAllDigit) {
      setError('trainNo', {message: '車號錯誤'});
      return;
    }
    console.log(data);
  });
  const bookingMethod = watch('bookingMethod');
  return (
    <Form
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        px: 1,
        pt: 2,
        pb: 4,
        overflow: 'auto',
      }}
    >
      <Controller
        name="startStation"
        control={control}
        render={({field}) => (
          <Select label="啟程站" {...field} options={stationOptions} />
        )}
      />
      <Controller
        name="endStation"
        control={control}
        render={({field}) => (
          <Select label="到達站" {...field} options={stationOptions} />
        )}
      />
      <Controller
        name="ticketDate"
        control={control}
        render={({field}) => (
          <DatePicker
            {...field}
            label={'訂票日期'}
            inputFormat="yyyy / MM / dd"
            renderInput={params => (
              <TextField {...params} helperText={null} fullWidth />
            )}
          />
        )}
      />
      <Controller
        name="bookingMethod"
        control={control}
        render={({field}) => (
          <Radios label="訂票方法" {...field} options={bookingMethodOptions} />
        )}
      />
      {bookingMethod === BookingMethod.trainNo && (
        <Controller
          name="trainNo"
          control={control}
          render={({field}) => (
            <TextField
              {...field}
              fullWidth
              label="車次號碼"
              error={!!formState.errors.trainNo}
              helperText={formState.errors.trainNo?.message}
            />
          )}
        />
      )}
      {bookingMethod === BookingMethod.time && (
        <Controller
          name="ticketDate"
          control={control}
          render={({field}) => (
            <TimePicker
              {...field}
              renderInput={params => <TextField {...params} fullWidth />}
              label="選擇時間"
              minTime={minTime}
              maxTime={maxTime}
              minutesStep={5}
              inputFormat="hh:mm aa"
            />
          )}
        />
      )}

      <Controller
        name="seatType"
        control={control}
        render={({field}) => (
          <Select label="座位選擇" {...field} options={seatTypeOptions} />
        )}
      />
      <Controller
        name="taiwanId"
        control={control}
        render={({field}) => (
          <TextField
            {...field}
            fullWidth
            label="身分證字號"
            error={!!formState.errors.taiwanId}
            helperText={formState.errors.taiwanId?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({field}) => (
          <TextField
            {...field}
            fullWidth
            label="E-Mail"
            type="email"
            autoComplete="email"
            error={!!formState.errors.email}
            helperText={formState.errors.email?.message}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({field}) => (
          <TextField
            {...field}
            fullWidth
            label="手機號碼"
            type="tel"
            autoComplete="tel"
          />
        )}
      />
      <Controller
        name="tickets.adultTicket"
        control={control}
        render={({field}) => (
          <Select
            label="全票"
            {...field}
            value={field.value.toString()}
            onChange={newValue => {
              field.onChange(parseInt(newValue));
            }}
            options={ticketOptions}
          />
        )}
      />
      <Controller
        name="tickets.collegeTicket"
        control={control}
        render={({field}) => (
          <Select
            label="大學生票"
            {...field}
            value={field.value.toString()}
            onChange={newValue => {
              field.onChange(parseInt(newValue));
            }}
            options={ticketOptions}
          />
        )}
      />
      <Typography color="error">{formState.errors.tickets?.message}</Typography>
      <Controller
        name="carType"
        control={control}
        render={({field}) => (
          <Radios label="車廂種類" {...field} options={carTypeOptions} />
        )}
      />
      <Controller
        name="carType"
        control={control}
        render={({field}) => (
          <Radios label="是否為高鐵會員" {...field} options={memberOptions} />
        )}
      />
      <Typography color="error">{formState.errors.email?.message}</Typography>
      <Button fullWidth variant="contained" type="submit">
        預約訂票
      </Button>
    </Form>
  );
};

export default IndexPage;
