import {ContentCopy} from '@mui/icons-material';
import {Box, Button, IconButton, Typography} from '@mui/material';
import {TicketResult} from '@prisma/client';
import React from 'react';

import {thsrHistoryWebsite} from '~/utils/constants';

import {useSnackbar} from '../Snackbar';

interface Props {
  ticketResult: TicketResult;
}

function TicketResultItem({ticketResult}: Props) {
  const snackbar = useSnackbar();

  const handleWriteTicketIdToClipboard = () => {
    navigator.clipboard.writeText(ticketResult.ticketId);
    snackbar.open({
      severity: 'success',
      message: `已複製 ${ticketResult.ticketId}`,
      autoHideDuration: 3_000,
    });
  };
  return (
    <>
      <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
        <Typography>{`車票號碼：${ticketResult.ticketId}`}</Typography>
        <IconButton sx={{p: 0}} onClick={handleWriteTicketIdToClipboard}>
          <ContentCopy fontSize="small" />
        </IconButton>
      </Box>
      <Typography>{`車次號碼：${ticketResult.trainNo}`}</Typography>
      <Typography>{`發車時間：${ticketResult.departureTime}`}</Typography>
      <Typography>{`抵達時間：${ticketResult.arrivalTime}`}</Typography>
      <Typography>{`總票價：${ticketResult.totalPrice} 元`}</Typography>
      <Button
        href={thsrHistoryWebsite}
        fullWidth
        variant="outlined"
        sx={{mt: 1}}
        color="success"
      >
        前往台灣高鐵網站查詢訂票結果
      </Button>
    </>
  );
}

export default TicketResultItem;
