import {zodResolver} from '@hookform/resolvers/zod';
import {SwapVert} from '@mui/icons-material';
import {Box, Button, IconButton, styled, TextField} from '@mui/material';
import {DatePicker, TimePicker} from '@mui/x-date-pickers';
import {useRouter} from 'next/router';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';

import {maxTime, minTime, stationOptions} from '~/utils/constants';
import {useStore} from '~/utils/store';
import {trpc} from '~/utils/trpc';

import Select from '../components/Select';
import {timeSearchSchema} from '../utils/schema';
import {NextPageWithLayout} from './_app';

const Form = styled('form')({});

const TimePage: NextPageWithLayout = () => {
  const router = useRouter();
  const {data, updateStore} = useStore();

  const utils = trpc.useContext();
  const {control, handleSubmit, setError, formState, setValue, getValues} =
    useForm({
      defaultValues: {
        startStation: data.startStation,
        endStation: data.endStation,
        ticketDate: data.ticketDate,
      },
      resolver: zodResolver(timeSearchSchema),
    });

  const onSubmit = handleSubmit(data => {
    if (data.endStation === data.startStation) {
      setError('endStation', {message: '到達站與啟程站不得相同'});
      return;
    }
    updateStore(data);
    const {ticketDate, startStation, endStation} = data;
    utils.time.search.prefetch({ticketDate});
    const searchParams = new URLSearchParams({
      ticketDate: ticketDate.toISOString(),
      startStation,
      endStation,
    });
    router.push(`/time/search?${searchParams}`);
  });

  const swapStations = () => {
    const startStation = getValues('startStation');
    const endStation = getValues('endStation');
    setValue('endStation', startStation);
    setValue('startStation', endStation);
  };

  return (
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
            inputFormat="yyyy / MM / dd"
            renderInput={params => (
              <TextField {...params} helperText={null} fullWidth />
            )}
          />
        )}
      />
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
      <Button fullWidth variant="contained" type="submit" sx={{mt: 2}}>
        查詢
      </Button>
    </Form>
  );
};
export default TimePage;
