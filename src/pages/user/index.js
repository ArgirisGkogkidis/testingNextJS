import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { LatestTokens } from '../../components/user/latest-tokens'
import { LatestProducts } from '../../components/dashboard/latest-products';
import PendingTokens from 'src/components/user/pending-tokens';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Dashboard = (props) => {
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
            justify="flex-start"
            alignItems="center"
          >
            {/* <Grid
              item
              lg={12}
              md={12}
              xl={9}
              xs={12}
            > */}
              <LatestTokens {...props} />
            {/* </Grid> */}
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
