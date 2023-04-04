import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  TypographyProps,
} from '@mui/material';
import React from 'react';

export interface CustomAlertProps {
  message: string;
  severity: TypographyProps['color'];

  isDialogOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

export function CustomAlert({
  onClose,
  onConfirm,
  severity,
  message,
  isDialogOpen,
}: CustomAlertProps) {
  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle sx={{pt: 4, px: 4}}>
        <Typography color={severity}>{message}</Typography>
      </DialogTitle>
      <DialogActions sx={{display: 'flex', justifyContent: 'center', pb: 4}}>
        {onConfirm && (
          <Button onClick={onConfirm} variant="outlined">
            確認
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" color="secondary">
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
}
