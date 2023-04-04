import {Alert as MuiAlert, AlertProps as MuiAlertProps} from '@mui/material';
import React from 'react';

const AlertInner = (props: MuiAlertProps, ref: React.Ref<HTMLDivElement>) => {
  return <MuiAlert {...props} ref={ref} />;
};

const Alert = React.forwardRef(AlertInner);

export default Alert;
