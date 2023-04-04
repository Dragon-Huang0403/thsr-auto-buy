import {
  AlertProps,
  Slide,
  SlideProps,
  Snackbar as MuiSnackbar,
  SnackbarProps as MuiSnackbarProps,
} from '@mui/material';
import React from 'react';

import Alert from './Alert';
type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

export interface SnackbarProps extends MuiSnackbarProps {
  severity?: AlertProps['severity'];
  message?: string;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  severity,
  message,
  ...props
}) => {
  return (
    <MuiSnackbar
      TransitionComponent={TransitionUp}
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      sx={{bottom: 32}}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </MuiSnackbar>
  );
};
