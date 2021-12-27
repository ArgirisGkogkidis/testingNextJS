import Head from 'next/head';
import { Box, Container, Typography,LinearProgress  } from '@mui/material';


const InitialLoading = () => (
  <>
    <Head>
      <title>
          Initializing App
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
        backgroundColor: '#111827',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            align="center"
            color="#ffffff"
            variant="h1"
          >
            Initializing DAPP
          </Typography>
          <Typography
            align="center"
            color="#ffffff"
            variant="subtitle2"
          >
            Loading componenets, init connection to Eth network, retrieve data
          </Typography>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <LinearProgress />
          </Box>
        </Box>
      </Container>
    </Box>
  </>
);

export default InitialLoading;