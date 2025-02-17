import React from 'react'
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { DashboardLayout } from '../components/dashboard-layout';
import Web3Container from '../utils/web3/Web3Container'
import InitialLoading from '../components/custom-loading'
import { SnackbarProvider } from 'notistack';
import Slide from '@mui/material/Slide';
import Register from './register'
import { useRouter } from 'next/router';
import Image from 'next/image' // Import the Image component from Next.js


const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const isRegistered = false;
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);
  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
      });
    }

  }, [])
  // Check if the current page is the specific page where you don't want Web3
  const shouldExcludeWeb3 = router.pathname.startsWith("/viewpack/[id]");

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Blockchain Food Supply
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={4}
          preventDuplicate
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          TransitionComponent={Slide}>

          {
            shouldExcludeWeb3 ? (
              // Directly render the component without Web3 for specific pages
              getLayout(<Component {...pageProps} />)
            ) : (

              <Web3Container
                renderLoading={({ open, message }) => <InitialLoading open={open}
                  msg={message} />}
                render={({ web3, accounts, tracking, management, isadmin, hasaccount, user }) => (
                  !hasaccount ? <Register accounts={accounts[0]}
                    web3={web3} /> :
                    <>
                      <DashboardLayout accounts={accounts[0]}
                        management={management}
                        web3={web3}
                        tracking={tracking}
                        isadmin={isadmin}
                        user={user}>
                        <Component {...pageProps}
                          accounts={accounts[0]}
                          management={management}
                          web3={web3}
                          tracking={tracking}
                          isadmin={isadmin}
                          user={user} />
                      </DashboardLayout>
                    </>
                )}
              />)}
        </SnackbarProvider>
      </ThemeProvider>
      {/* </LocalizationProvider> */}
      {shouldExcludeWeb3 ? <div className="floating-image">
        <Image src="/static/images/eu_logo.png" alt="Floating Image" width={300} height={'100'} />
      </div> : ''}
    </CacheProvider>
  )
};

export default App;
