import {CssBaseline} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import type {NextPage} from 'next';
import type {AppProps, AppType} from 'next/app';
import type {ReactElement, ReactNode} from 'react';

import {CustomAlertProvider} from '~/components/CustomAlert';
import {DefaultLayout} from '~/components/DefaultLayout';
import {SnackbarProvider} from '~/components/Snackbar';
import {StoreProvider} from '~/utils/store';
import {trpc} from '~/utils/trpc';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({Component, pageProps}: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? (page => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <CustomAlertProvider>
        <SnackbarProvider>
          <StoreProvider>
            {getLayout(<Component {...pageProps} />)}
          </StoreProvider>
        </SnackbarProvider>
      </CustomAlertProvider>
    </LocalizationProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
