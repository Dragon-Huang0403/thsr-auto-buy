import {
  ArrowBackRounded,
  DirectionsTransitRounded,
  EastRounded,
  ExpandMore,
  KeyboardDoubleArrowRightRounded,
  ScheduleRounded,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import {z} from 'zod';

import {discountTypes, stationObjects} from '~/utils/constants';
import {handleTrainItem} from '~/utils/helpers';
import {timeSearchSchema} from '~/utils/schema';
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
  const router = useRouter();
  const routerQuery = querySchema.parse(router.query);

  const {
    data: timeTable,
    isError,
    error,
    isLoading,
  } = trpc.time.search.useQuery(
    {ticketDate: routerQuery?.ticketDate as Date},
    {enabled: !!routerQuery},
  );

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

  const {startStation, endStation} = routerQuery;
  const trainItems = handleTrainItem(timeTable, routerQuery);

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

      <Box sx={{overflow: 'auto', height: 'calc(100% - 60px)', pb: 2}}>
        {trainItems.map(trainItem => (
          <Accordion
            key={trainItem.trainInfo.TrainNo}
            disableGutters
            sx={{border: theme => `1px solid ${theme.palette.divider}`}}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  pr: 2,
                }}
              >
                <Typography>{trainItem.startStop.DepartureTime}</Typography>
                <EastRounded />
                <Typography>{trainItem.endStop.DepartureTime}</Typography>
                <ScheduleRounded fontSize="small" />
                <Typography variant="body2">{trainItem.duration}</Typography>
                <DirectionsTransitRounded fontSize="small" />
                <Typography>{trainItem.trainInfo.TrainNo}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}>
              <Box sx={{display: 'flex'}}>
                <Box sx={{display: 'flex', gap: 1}}>
                  {trainItem.discounts.map(discount => {
                    const {minDiscountRatio} = discount;
                    const ratio =
                      minDiscountRatio % 10 === 0
                        ? (minDiscountRatio / 10).toString()
                        : minDiscountRatio.toString();
                    const label = `${discountTypes[discount.type]} ${ratio} 折`;
                    return <Chip key={discount.type} label={label} />;
                  })}
                </Box>
                <Button variant="contained" sx={{ml: 'auto'}}>
                  預約訂票
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default SearchTrain;
