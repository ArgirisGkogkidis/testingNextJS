import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  CardContent,
  Container,
  Backdrop,
  Fade,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
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

const SplitModal = ({ open, onClose, onSplit, token }) => {
  const [splitValue, setSplitValue] = React.useState(0); // Default split value

  const handleSliderChange = (event, newValue) => {
    setSplitValue(newValue);
  };

  const handleSubmit = () => {
    onSplit(splitValue);
    // onClose(); // Optionally close the modal after submission
  };

  // Effect to reset the form when the modal is closed or opened
  // Update the slider's default value when the modal opens with a new token
  React.useEffect(() => {
    if (open && token && token.amount) {
      setSplitValue(Number(token.amount) / 2); // Default to half of the token's amount, or any other logic
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
      aria-labelledby='split-modal-title'
      aria-describedby='split-modal-description'
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id='split-modal-title' variant='h6' component='h2'>
            Split Token
          </Typography>
          <FormControl component='fieldset' sx={{ mt: 2, width: '100%' }}>
            <FormLabel component='legend'>Select Split Value</FormLabel>
            <Slider
              value={splitValue}
              onChange={handleSliderChange}
              aria-labelledby='split-amount-slider'
              valueLabelDisplay='auto'
              step={1}
              min={1}
              max={token ? Number(token.amount) : 100} // Assuming token.amount is the max value in kilos
            />
          </FormControl>
          <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit}>
            Split
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SplitModal;
