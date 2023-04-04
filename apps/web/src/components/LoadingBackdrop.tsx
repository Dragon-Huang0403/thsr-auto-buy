import {Backdrop, CircularProgress} from '@mui/material';
import React from 'react';

interface LoadingBackdropProps {
  open: boolean;
}

function LoadingBackdrop({open}: LoadingBackdropProps) {
  return (
    <Backdrop
      sx={theme => ({
        color: theme.palette.common.white,
        zIndex: theme.zIndex.drawer + 1,
      })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default LoadingBackdrop;
