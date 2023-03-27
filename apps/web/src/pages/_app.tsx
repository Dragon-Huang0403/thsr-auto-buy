import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import type {NextPage} from 'next';
import type {AppProps, AppType} from 'next/app';
import type {ReactElement, ReactNode} from 'react';

import {DefaultLayout} from '~/components/DefaultLayout';
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
      {getLayout(<Component {...pageProps} />)}
    </LocalizationProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
