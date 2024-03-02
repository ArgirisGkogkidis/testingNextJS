import React from 'react';
import {
  Modal, Box, Typography, TextField, Button, Card,
  CardContent, Container, Backdrop, Fade
} from '@mui/material';

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

const TransferModal = ({ open, onClose, onTransfer, token }) => {
  // Local state to hold the recipient's address
  const [recipientAddress, setRecipientAddress] = React.useState('');

  const handleRecipientChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleSubmit = () => {
    // Call the onTransfer prop with both token and recipientAddress
    onTransfer(recipientAddress);
    // onClose(); // Optionally close the modal after submission
  };

  // Effect to reset the form when the modal is closed or opened.
  React.useEffect(() => {
    if (!open) {
      setRecipientAddress('');
    }
  }, [open]);
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
            <TextField
              fullWidth
              id="recipient-address"
              label="Recipient Address"
              value={recipientAddress}
              onChange={handleRecipientChange}
              margin="normal"
            />
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
