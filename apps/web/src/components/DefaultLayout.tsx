import {AppBar, Box, Container, Tab, Tabs} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {ReactNode} from 'react';

type DefaultLayoutProps = {children: ReactNode};

const routes = [
  {href: '/time', name: '時刻表', regex: /^\/time/},
  {
    href: '/',
    name: '預約訂票',
    regex: /^\/$/,
  },
  {href: '/reservation', name: '訂票紀錄', regex: /^\/reservation/},
] as const;

export const DefaultLayout = ({children}: DefaultLayoutProps) => {
  const {pathname} = useRouter();
  const tabValue =
    routes.find(route => pathname.match(route.regex))?.href ?? '/';
  return (
    <>
      <Head>
        <title>高鐵自動購票</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container disableGutters sx={{pt: 6, height: '100vh'}}>
        <AppBar>
          <Tabs
            centered
            variant="fullWidth"
            value={tabValue}
            indicatorColor="secondary"
            textColor="inherit"
          >
            {routes.map(route => (
              <Tab
                label={route.name}
                key={route.name}
                href={route.href}
                value={route.href}
                LinkComponent={NextLink}
              />
            ))}
          </Tabs>
        </AppBar>
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </Container>
    </>
  );
};
