import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { LatestTokens } from '../components/user/latest-tokens'
import { LatestProducts } from '../components/dashboard/latest-products';
import Router from 'next/router'
import PendingTokens from 'src/components/user/pending-tokens';

const Dashboard = (props) => {

  if (props.isadmin) {
    Router.push('/admin')
  }

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
        <Container maxWidth={false}>
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
              <LatestTokens {...props} />
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              xl={9}
              xs={12}
            >
              <PendingTokens {...props} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>)
}

// Dashboard.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default Dashboard;
