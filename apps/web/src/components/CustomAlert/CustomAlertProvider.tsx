import React, {createContext, ReactNode, useContext, useState} from 'react';

import {CustomAlert, CustomAlertProps} from './CustomAlert';

type Config = Omit<CustomAlertProps, 'isDialogOpen'> & {
  onClose?: () => void;
};

interface TCustomAlertContext {
  open: (config: Config) => void;
  close: () => void;
}

const CustomAlertContext = createContext({} as TCustomAlertContext);

interface Props {
  children: ReactNode;
}

export function CustomAlertProvider({children}: Props) {
  const [config, setConfig] = useState<null | Config>(null);
  const value: TCustomAlertContext = {
    open: newConfig => {
      setConfig(newConfig);
    },
    close: () => {
      setConfig(null);
    },
  };
  return (
    <CustomAlertContext.Provider value={value}>
      {children}
      {config && (
        <CustomAlert
          isDialogOpen={true}
          message={config.message}
          severity={config.severity}
          onClose={() => {
            config.onClose?.();
            setConfig(null);
          }}
          onConfirm={() => {
            config.onConfirm?.();
            setConfig(null);
          }}
        />
      )}
    </CustomAlertContext.Provider>
  );
}

export const useCustomAlert = () => {
  const customAlert = useContext(CustomAlertContext);
  return customAlert;
};
