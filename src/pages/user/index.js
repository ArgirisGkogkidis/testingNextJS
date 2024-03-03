import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { LatestTokens } from '../../components/user/latest-tokens';
import PendingTokens from 'src/components/user/pending-tokens';

const Dashboard = (props) => {
  const [refreshTokens, setRefreshTokens] = useState(false);
  const [userPerms, setUserPerms] = useState({});

  // Function to toggle the refresh state
  const triggerRefresh = () => {
    setRefreshTokens(prev => !prev);
  };

  useEffect(() => {
    const fetchUserPerms = async () => {
      const perms = await props.management.methods.get_user_perms(props.accounts).call();
      if (JSON.stringify(perms) !== JSON.stringify(userPerms)) {
        setUserPerms({
          canMint: perms.canMint,
          canPack: perms.canPack,
          canReceive: perms.canReceive,
          canSplit: perms.canSplit,
          canTransfer: perms.canTransfer
        });
      }
    };

    fetchUserPerms();
  }, [props.management, props.accounts]);


  return (
    <>
      <Head>
        <title>
          Dashboard | Material Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={12}
              md={12}
              xl={9}
              xs={12}
            >
              {userPerms ? <LatestTokens {...props} refreshtokens={refreshTokens} onrefreshcomplete={triggerRefresh} userperms={userPerms} /> : ''}
            </Grid>
            {userPerms && userPerms.canReceive ?
              <Grid
                item
                lg={12}
                md={12}
                xl={9}
                xs={12}
              >
                <PendingTokens {...props} onTokenAccepted={triggerRefresh} userPerms={userPerms} />
              </Grid> : ''}
          </Grid>
        </Container>
      </Box>
    </>)
}

export default Dashboard;
