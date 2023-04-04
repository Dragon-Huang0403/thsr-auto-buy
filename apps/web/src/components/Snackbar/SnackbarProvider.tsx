import React, {createContext, useContext, useMemo, useState} from 'react';

import {Snackbar, SnackbarProps} from './Snackbar';

interface SnackbarContext {
  open: (config: SnackbarProps) => void;
  close: () => void;
}

const SnackbarContext = createContext({} as SnackbarContext);

export interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbarConfig, setSnackbarConfig] = useState<SnackbarConfig>({
    open: false,
  });
  const value: SnackbarContext = useMemo(
    () => ({
      open: config => {
        setSnackbarConfig({...config, open: true});
      },
      close: () => {
        setSnackbarConfig(prev => ({...prev, open: false}));
      },
    }),
    [],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        {...snackbarConfig}
        onClose={() => {
          value.close();
        }}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

type SnackbarConfig = {open: boolean} & SnackbarProps;
