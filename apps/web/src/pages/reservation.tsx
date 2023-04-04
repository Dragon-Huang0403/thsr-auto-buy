import {zodResolver} from '@hookform/resolvers/zod';
import {Box, Button, styled, TextField} from '@mui/material';
import {Controller, useForm} from 'react-hook-form';

import {useCustomAlert} from '~/components/CustomAlert';
import LoadingBackdrop from '~/components/LoadingBackdrop';
import {ReservationItem} from '~/components/ReservationItem';
import {useSnackbar} from '~/components/Snackbar';
import {reservationSchema} from '~/utils/schema';
import {useStore} from '~/utils/store';
import {trpc} from '~/utils/trpc';

import {NextPageWithLayout} from './_app';

const Form = styled('form')({});

const taiwanIdSchema = reservationSchema.pick({taiwanId: true});

const ReservationPage: NextPageWithLayout = () => {
  const {updateStore, data} = useStore();
  const {control, formState, handleSubmit, watch} = useForm({
    defaultValues: {taiwanId: data.taiwanId},
    resolver: zodResolver(taiwanIdSchema),
  });

  const taiwanId = watch('taiwanId');
  const {data: reservations, refetch} = trpc.reservation.byTaiwanId.useQuery(
    {taiwanId},
    {
      keepPreviousData: true,
      enabled: false,
    },
  );
  const customAlert = useCustomAlert();
  const snackbar = useSnackbar();

  const onSubmit = handleSubmit(data => {
    updateStore(data);
    refetch();
  });
  const deleteMutation = trpc.reservation.delete.useMutation({
    onSuccess: () => {
      refetch();
      snackbar.open({
        message: '刪除成功',
        autoHideDuration: 3_000,
        severity: 'success',
      });
    },
    onError: e => {
      snackbar.open({
        message: `${e.message}`,
        autoHideDuration: 3_000,
        severity: 'error',
      });
    },
  });

  const handleOnDelete = (reservationId: number) => {
    customAlert.open({
      message: '確定要刪除嗎？',
      severity: 'warning',
      onConfirm: () => {
        deleteMutation.mutate({reservationId});
      },
    });
  };

  return (
    <Box sx={{pt: 4, px: 2, height: '100%', overflow: 'auto'}}>
      <Form
        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
        onSubmit={onSubmit}
      >
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
        <Button type="submit" fullWidth variant="contained">
          查詢
        </Button>
      </Form>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, my: 2}}>
        {reservations?.map(reservation => (
          <ReservationItem
            key={reservation.id}
            reservation={reservation}
            onDelete={() => handleOnDelete(reservation.id)}
          />
        ))}
      </Box>
      <LoadingBackdrop open={deleteMutation.isLoading} />
    </Box>
  );
};

export default ReservationPage;
