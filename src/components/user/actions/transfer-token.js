import React from 'react';
import {
  Modal, Box, Typography, TextField, Button, Card,
  CardContent, Container, Backdrop, Fade,
  FormControl, FormLabel, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, // Adjust width as needed
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const TransferModal = ({ open, onClose, onTransfer, token, management }) => {
  // Local state to hold the recipient's address
  const [recipientAddress, setRecipientAddress] = React.useState('');
  const [recipientOptions, setRecipientOptions] = React.useState([]);

  const handleRecipientChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleSubmit = () => {
    // Call the onTransfer prop with both token and recipientAddress
    onTransfer(recipientAddress);
    // onClose(); // Optionally close the modal after submission
  };

  // Effect to reset the form when the modal is closed or opened.
  React.useEffect(async () => {
    if (open && token) {
      setRecipientAddress('');
      setRecipientOptions([])
      const users = await axios.get('http://127.0.0.1:4000/api/v1/users');
      for (const user of users.data.data) {

        const canReceive = await management.methods.get_perm_receive(user.wallet, token.ingredient).call();

        if (canReceive)
          setRecipientOptions(prevProducts => ([
            ...prevProducts,
            {
              id: user.wallet,
              name: user.firstName + ' ' + user.lastName,
            }
          ]))
      }
      console.log(recipientOptions)
    }
  }, [open, token]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      aria-labelledby="transfer-modal-title"
      aria-describedby="transfer-modal-description"
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transfer-modal-title" variant="h6" component="h2">
            Transfer Token
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2, width: '100%' }}>
            {/* <TextField
              fullWidth
              id="recipient-address"
              label="Recipient Address"
              value={recipientAddress}
              onChange={handleRecipientChange}
              margin="normal"
            /> */}
            <FormControl component='fieldset' sx={{ mt: 2, width: '100%' }}>
              <InputLabel id="token-id-select-label">Token ID to Mint</InputLabel>
              <Select
                labelId="token-id-select-label"
                id="recipient-address"
                value={recipientAddress}
                label="Token ID to Mint"
                onChange={handleRecipientChange}
              >
                {recipientOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Transfer
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TransferModal;
