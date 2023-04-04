import DeleteIcon from '@mui/icons-material/Delete';
import {Alert, Box, IconButton, Paper, Typography} from '@mui/material';
import {
  BookingMethod,
  MemberType,
  Reservation,
  TicketResult,
} from '@prisma/client';
import {format} from 'date-fns';

import {
  bookingMethodObject,
  carTypeObject,
  seatTypeObject,
  stationObjects,
} from '~/utils/constants';

import TicketResultItem from './TicketResultItem';

interface Props {
  reservation: Pick<
    Reservation,
    | 'startStation'
    | 'endStation'
    | 'ticketDate'
    | 'bookDate'
    | 'bookingMethod'
    | 'trainNo'
    | 'seatType'
    | 'carType'
    | 'adultTicket'
    | 'collegeTicket'
    | 'email'
    | 'taiwanId'
    | 'memberType'
  > & {
    ticketResult: TicketResult | null;
  };
  onDelete: () => void;
}

const statusText = {
  success: '訂票成功',
  info: '尚未開放購票',
  error: '訂票失敗',
} as const;

function ReservationItem({reservation, onDelete}: Props) {
  const now = new Date();
  const status = reservation.ticketResult
    ? 'success'
    : reservation.bookDate > now
    ? 'info'
    : 'error';

  return (
    <Paper
      sx={{
        border: theme => `2px solid ${theme.palette[status].light}`,
        p: 2,
        position: 'relative',
      }}
      elevation={3}
    >
      <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
        <Alert severity={status} sx={{flexGrow: 1}}>
          {statusText[status]}
        </Alert>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Typography>{`啟程站：${
        stationObjects[reservation.startStation].name
      }`}</Typography>
      <Typography>{`到達站：${
        stationObjects[reservation.endStation].name
      }`}</Typography>
      <Typography>{`車票日期：${format(
        reservation.ticketDate,
        'yyyy-MM-dd',
      )}`}</Typography>
      <Typography>{`開放售票日期：${format(
        reservation.bookDate,
        'yyyy-MM-dd',
      )}`}</Typography>
      <Typography>{`訂票方法：${
        bookingMethodObject[reservation.bookingMethod]
      }`}</Typography>
      {reservation.bookingMethod === BookingMethod.time ? (
        <Typography>{`預計時間：${format(
          reservation.ticketDate,
          'HH:mm',
        )}`}</Typography>
      ) : (
        <Typography>{`選擇車次：${reservation.trainNo}`}</Typography>
      )}
      <Typography>{`座位偏好：${
        seatTypeObject[reservation.seatType]
      }`}</Typography>
      <Typography>{`車廂種類：${
        carTypeObject[reservation.carType]
      }`}</Typography>

      <Typography>{`身分證字號：${reservation.taiwanId}`}</Typography>
      {reservation.email && (
        <Typography>{`電子信箱：${reservation.email}`}</Typography>
      )}
      {!!reservation.adultTicket && (
        <Typography>{`全票：${reservation.adultTicket}`}</Typography>
      )}
      {!!reservation.collegeTicket && (
        <Typography>{`大學生：${reservation.collegeTicket}`}</Typography>
      )}
      <Typography>{`會員：${
        reservation.memberType === MemberType.Member ? '是' : '否'
      }`}</Typography>
      {reservation.ticketResult && (
        <TicketResultItem ticketResult={reservation.ticketResult} />
      )}
    </Paper>
  );
}

export default ReservationItem;
