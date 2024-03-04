import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { UserPacks } from '../../components/user/pack/pack'
import ViewPacks from 'src/components/user/pack/view/superPacks';


const viewPack = (props) => {
  return (
    <>
      <Head>
        <title>
          View Pack | Material Kit
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
            <Grid
              item
              lg={12}
              md={12}
              xl={9}
              xs={12}
            >
              {/* <UserPacks {...props} /> */}
              <ViewPacks {...props} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>)
}


export default viewPack;
