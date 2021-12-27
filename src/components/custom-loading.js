import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography, LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const InitialLoading = (props) => {
  console.log("loading screen")
  console.log(props)
  const [open, setOpen] = React.useState(props.open);
  const [message, setMessage] = React.useState(props.msg);

  React.useEffect(()=>{
    setOpen(props.open)
    setMessage(props.msg)
  },[props.open, props.msg])

  const handleClose = () => {
    setOpen(false);
  };

  return (
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
              Loading componenets, init connection to Eth network, retrieve data<br></br>
              {message}
            </Typography>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <LinearProgress />
            </Box>
          </Box>
        </Container>
      </Box>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"An error occured!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.msg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Got It
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default InitialLoading;
