import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { useSnackbar } from 'notistack';
import Link from 'next/link'
import { useRouter } from 'next/router'

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const DashboardLayout = (props) => {

  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { tracking, accounts } = props;
  const router = useRouter();
  // customized
  const action = key => (
    <React.Fragment>
      <Link href={`/user/gettoken/${key}`}>
        View Item
      </Link>
      {/* <Button onClick={() => { alert(`I belong to snackbar with key ${key}`); }}>
        View Item
      </Button> */}
      <Button onClick={() => { closeSnackbar(key) }}>
        Dismiss
      </Button>
    </React.Fragment>
  );

  const [events, setEvents] = React.useState([]);

  // Effect to listen for blockchain events
  React.useEffect(() => {
    const eventSubscription = tracking.events.TokenTransferred({
      fromBlock: 0, toBlock: 'latest'
    })
      .on('data', (event) => {
        // console.log('Event received:', event, event.returnValues.tokenHash, event.returnValues.to);
        generateSnacks(event.returnValues.tokenHash, event.returnValues.to)
        setEvents((prevEvents) => [...prevEvents, event]);
      })
      .on('error', console.error);

    // Cleanup
    return () => {
      eventSubscription.unsubscribe();
    };
  }, []); // Runs once on mount

  // Another effect that depends on `events` state
  React.useEffect(() => {
    // This code runs when `events` state changes
    if (events.length > 0) {
      // console.log("New event added:", events[events.length - 1]);
      // Do something in response to a new event
    }
  }, [events]); // Reacts to changes in `events`



  // useEffect(() => {
  //   const results2 = tracking.events.TokenTransferred({ fromBlock: 0, toBlock: 'latest' }, function (err, result) {
  //     if (err) {
  //       console.log(err)
  //       return;
  //     }

  //     const owner = result.returnValues.to
  //     const tokenHash = result.returnValues.tokenHash
  //     generateSnacks(tokenHash, owner)
  //   })
  // }, [tracking.events])

  async function generateSnacks(tokenHash, owner) {

    const tknD = await tracking.methods.getTokenData(tokenHash).call()

    if (accounts === owner && Number(tknD[1]) == 2 && Number(tknD[3]) != accounts) {
      const tokenLink = tokenHash;

      if (router.asPath.indexOf(tokenLink) != -1)
        return
      enqueueSnackbar("Pending receive token", {
        variant: 'info',
        key: tokenLink,
        persist: true,
        action,
      })
    }
  }

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
        accounts={props.accounts}
        tracking={props.tracking}
        management={props.management}
        isadmin={props.isadmin}
        user={props.user}
      />
    </>
  );
};
