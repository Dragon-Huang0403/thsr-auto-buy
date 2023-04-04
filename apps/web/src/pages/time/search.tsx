import {
  ArrowBackRounded,
  DirectionsTransitRounded,
  EastRounded,
  KeyboardDoubleArrowRightRounded,
  ScheduleRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormLabel,
  IconButton,
  Typography,
} from '@mui/material';
import {BookingMethod, DiscountType} from '@prisma/client';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {z} from 'zod';

import {discountTypes, stationObjects} from '~/utils/constants';
import {handleTrainItem, objectKeys} from '~/utils/helpers';
import {timeSearchSchema} from '~/utils/schema';
import {useStore} from '~/utils/store';
import {trpc} from '~/utils/trpc';

import {NextPageWithLayout} from '../_app';

const querySchema = timeSearchSchema
  .omit({ticketDate: true})
  .extend({
    ticketDate: z
      .string()
      .datetime()
      .transform(str => new Date(str)),
  })
  .or(z.null())
  .catch(null);

const SearchTrain: NextPageWithLayout = () => {
  const [discountFilter, setDiscountFilter] = useState({
    [DiscountType.earlyBird]: false,
    [DiscountType.college]: false,
  });
  const [isScrollIntoViewDone, setIsScrollIntoViewDone] = useState(false);

  const scrollElementRef = useRef<null | HTMLElement>(null);

  const {updateStore} = useStore();
  const router = useRouter();
  const routerQuery = querySchema.parse(router.query);

  const {
    data: timeTable,
    isError,
    error,
    isLoading,
    isSuccess,
  } = trpc.time.search.useQuery(
    {ticketDate: routerQuery?.ticketDate as Date},
    {enabled: !!routerQuery},
  );

  useEffect(() => {
    if (isSuccess) {
      scrollElementRef?.current?.scrollIntoView();
      setIsScrollIntoViewDone(true);
    }
  }, [isSuccess]);

  if (!routerQuery || isError) {
    return (
      <Box sx={{position: 'relative'}}>
        <IconButton LinkComponent={NextLink} href="/time">
          <ArrowBackRounded />
        </IconButton>
        <Typography color={'error'} variant="h5">
          {error?.message || '發生錯誤，請回到上一頁'}
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{position: 'relative'}}>
        <IconButton LinkComponent={NextLink} href="/time">
          <ArrowBackRounded />
        </IconButton>
        <Typography variant="h5">載入中...</Typography>
      </Box>
    );
  }

  const {startStation, endStation, ticketDate} = routerQuery;
  const _trainItems = handleTrainItem(timeTable, routerQuery);
  const trainItems = _trainItems.filter(item =>
    objectKeys(discountFilter)
      .map(discountType => {
        if (!discountFilter[discountType]) {
          return true;
        }
        const hasDiscount = item.discounts.some(
          discount => discount.type === discountType,
        );
        return hasDiscount;
      })
      .every(shouldRender => shouldRender),
  );
  const defaultDisplayIndex = trainItems.findIndex(
    item => item.departureTime > ticketDate,
  );

  const handleReserveTrain = (trainNo: string) => {
    updateStore({
      trainNo,
      startStation,
      endStation,
      bookingMethod: BookingMethod.trainNo,
    });
    router.push('/');
  };

  const handleDiscountCheckedOnChange = (type: DiscountType) => {
    setDiscountFilter(prev => ({...prev, [type]: !prev[type]}));
  };

  return (
    <Box sx={{position: 'relative', height: '100%'}}>
      <IconButton
        sx={{position: 'absolute', left: 0}}
        LinkComponent={NextLink}
        href="/time"
      >
        <ArrowBackRounded />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          py: 1,
        }}
      >
        <Typography variant="h5">
          {stationObjects[startStation].name}
        </Typography>
        <KeyboardDoubleArrowRightRounded />
        <Typography variant="h5">{stationObjects[endStation].name}</Typography>
      </Box>
      <FormLabel component="legend" sx={{px: 2}}>
        僅顯示優惠車次
      </FormLabel>
      <Box sx={{display: 'flex', gap: 2, px: 2}}>
        {objectKeys(discountFilter).map(discountType => (
          <FormControlLabel
            key={discountType}
            label={`${discountTypes[discountType]}優惠`}
            control={
              <Checkbox
                checked={discountFilter[discountType]}
                onChange={() => {
                  handleDiscountCheckedOnChange(discountType);
                }}
              />
            }
          />
        ))}
      </Box>
      <Box
        sx={{
          overflow: 'auto',
          height: 'calc(100% - 130px)',
          pb: 2,
          visibility: isScrollIntoViewDone ? 'visible' : 'hidden',
        }}
      >
        {trainItems.map((trainItem, i) => (
          <Box
            key={trainItem.trainInfo.TrainNo}
            sx={{
              border: theme => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              px: 2,
              py: 1,
            }}
            ref={i === defaultDisplayIndex ? scrollElementRef : undefined}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                pr: 2,
                py: 1,
              }}
            >
              <Box sx={{display: 'flex', gap: 1}}>
                <Typography>{trainItem.startStop.DepartureTime}</Typography>
                <EastRounded />
                <Typography>{trainItem.endStop.ArrivalTime}</Typography>
              </Box>
              <Box sx={{display: 'flex', gap: 1}}>
                <ScheduleRounded fontSize="small" />
                <Typography variant="body2">{trainItem.duration}</Typography>
              </Box>
              <Box sx={{display: 'flex', gap: 1}}>
                <DirectionsTransitRounded fontSize="small" />
                <Typography>{trainItem.trainInfo.TrainNo}</Typography>
              </Box>
            </Box>
            <Box sx={{display: 'flex'}}>
              <Box sx={{display: 'flex', gap: 1}}>
                {trainItem.discounts.length === 0 ? (
                  <Typography>此班次無早鳥及大學生優惠</Typography>
                ) : (
                  trainItem.discounts.map(discount => {
                    const {minDiscountRatio} = discount;
                    const ratio =
                      minDiscountRatio % 10 === 0
                        ? (minDiscountRatio / 10).toString()
                        : minDiscountRatio.toString();
                    const label = `${discountTypes[discount.type]} ${ratio} 折`;
                    return <Chip key={discount.type} label={label} />;
                  })
                )}
              </Box>
              <Button
                variant="contained"
                sx={{ml: 'auto'}}
                onClick={() => {
                  handleReserveTrain(trainItem.trainInfo.TrainNo);
                }}
              >
                預約訂票
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SearchTrain;
