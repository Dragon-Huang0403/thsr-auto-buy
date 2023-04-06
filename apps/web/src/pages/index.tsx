import {zodResolver} from '@hookform/resolvers/zod';
import {SwapVert} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import {DatePicker, TimePicker} from '@mui/x-date-pickers';
import {BookingMethod} from '@prisma/client';
import {addMonths} from 'date-fns';
import NextLink from 'next/link';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';

import LoadingBackdrop from '~/components/LoadingBackdrop';
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
import {useStore} from '~/utils/store';
import {trpc} from '~/utils/trpc';

import Radios from '../components/Radios';
import Select from '../components/Select';
import {NextPageWithLayout} from './_app';

const Form = styled('form')({});

const IndexPage: NextPageWithLayout = () => {
  const {updateStore, data: store} = useStore();
  const {
    control,
    formState,
    handleSubmit,
    watch,
    setError,
    getValues,
    setValue,
  } = useForm({
    defaultValues: store,
    resolver: zodResolver(reservationSchema),
  });

  const utils = trpc.useContext();

  const addReservation = trpc.reservation.add.useMutation();

  const onSubmit = handleSubmit(_data => {
    const data = _data as z.infer<typeof reservationSchema>;
    updateStore(data);
    const isBookByTrainNo = data.bookingMethod === BookingMethod.trainNo;
    const isTrainNoAllDigit = /^\d{3,4}$/.test(data.trainNo);
    if (isBookByTrainNo && !isTrainNoAllDigit) {
      setError('trainNo', {message: '車號錯誤'});
      return;
    }
    if (data.endStation === data.startStation) {
      setError('endStation', {message: '到達站與啟程站不得相同'});
      return;
    }
    addReservation.mutate(data, {
      onSuccess: () => {
        utils.reservation.byTaiwanId.invalidate({taiwanId: data.taiwanId});
        utils.reservation.byTaiwanId.prefetch({taiwanId: data.taiwanId});
      },
    });
  });
  const bookingMethod = watch('bookingMethod');

  const swapStations = () => {
    const startStation = getValues('startStation');
    const endStation = getValues('endStation');
    setValue('endStation', startStation);
    setValue('startStation', endStation);
  };
  const {data: minDate} = trpc.time.minReservingDate.useQuery(undefined, {
    onSuccess: minDate => {
      if (!getValues('ticketDate')) {
        setValue('ticketDate', minDate);
      }
      if (!store.ticketDate) {
        updateStore({ticketDate: minDate});
      }
    },
    initialData: () => addMonths(new Date(), 1),
  });

  return (
    <>
      <Form
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          px: 2,
          pt: 4,
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
        <Box sx={{position: 'relative', my: -1}}>
          <IconButton
            sx={{
              position: 'absolute',
              zIndex: 100,
              left: '50%',
              top: '50%',
              translate: '-50% -50%',
              bgcolor: theme => theme.palette.common.white,
              border: theme => `1px solid ${theme.palette.grey[500]}`,
              borderRadius: '50%',
              '&:hover': {
                bgcolor: theme => theme.palette.common.white,
              },
            }}
            onClick={swapStations}
          >
            <SwapVert />
          </IconButton>
        </Box>
        <Controller
          name="endStation"
          control={control}
          render={({field}) => (
            <Select
              label="到達站"
              {...field}
              options={stationOptions}
              error={!!formState.errors.endStation}
              helperText={formState.errors.endStation?.message}
            />
          )}
        />
        <Controller
          name="ticketDate"
          control={control}
          render={({field}) => (
            <DatePicker
              {...field}
              label={'訂票日期'}
              minDate={minDate}
              maxDate={addMonths(minDate, 1)}
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
            <Radios
              label="訂票方法"
              {...field}
              options={bookingMethodOptions}
            />
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
                ampm={false}
                minTime={minTime}
                maxTime={maxTime}
                minutesStep={5}
                inputFormat="HH:mm"
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
        <Typography color="error">
          {formState.errors.tickets?.message}
        </Typography>
        <Controller
          name="carType"
          control={control}
          render={({field}) => (
            <Radios label="車廂種類" {...field} options={carTypeOptions} />
          )}
        />
        <Controller
          name="memberType"
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
      <LoadingBackdrop open={addReservation.isLoading} />
      <Dialog open={addReservation.isSuccess}>
        <DialogTitle sx={{px: 10, pt: 4}}>預約成功</DialogTitle>
        <DialogActions sx={{px: 4, pb: 2}}>
          <Button
            fullWidth
            variant="outlined"
            href="/reservation"
            LinkComponent={NextLink}
          >
            查看訂票紀錄
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IndexPage;
