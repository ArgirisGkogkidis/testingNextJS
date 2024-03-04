import React, { useEffect, useState } from 'react'
import {
  Modal, Box, Button,
  Card,
  CardContent, Container, TextField,
  Typography,
  Snackbar, MenuItem, Backdrop, Fade,
  FormControl, FormLabel, InputLabel, Select
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

const MintModal = ({ isopen, onClose, tracking, accounts, management, triggerrefresh }) => {
  const [tokenIdToMint, setTokenIdToMint] = useState("")
  const [tokenQuantity, setTokenQuantity] = useState("")
  const [tokenOptions, setTokenOptions] = useState([]);

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });

  const { vertical, horizontal, open } = state;
  const [snackBarMessage, setSnackBarMessage] = useState("a dummy message");

  const handleClose = () => {
    setState({
      open: false, vertical: 'top',
      horizontal: 'center'
    });
  };
  function handleTokenIdToMint(event) {
    const { value } = event.target
    setTokenIdToMint(value)
  }

  const convertKgToMilligrams = (kg) => Math.round(kg * 1e6);

  const handleTokenIdToMintChange = (event) => {
    setTokenIdToMint(event.target.value);
  };
  function handleTokenQuantity(event) {
    const { value } = event.target
    setTokenQuantity(value);
  }

  async function mintToken() {
    if (!accounts) {
      setSnackBarMessage("Need an Ethereum address to check")
      setState({
        open: true,
        vertical: 'top',
        horizontal: 'center'
      });
      return;
    }

    if (!tokenIdToMint || !tokenQuantity) {
      setSnackBarMessage("Input missing")
      setState({
        open: true,
        vertical: 'top',
        horizontal: 'center'
      });
      return;
    }

    // await contract.methods.mint_token(tokenIdToMint, tokenQuantity).send({ from: props.account });
    const rs = await tracking.methods.mint_token(tokenIdToMint, convertKgToMilligrams(tokenQuantity)).send({ from: accounts });
    console.log(rs);
    triggerrefresh();
    onClose();
    setSnackBarMessage("Token created successfully")
    setState({
      open: true,
      vertical: 'top',
      horizontal: 'center'
    });
  }

  useEffect(async () => {

    if (isopen) {
      setTokenOptions([]);
      await management.methods.getIngredientIDs().call().then(async ingredientIDs => {
        for (const ingredientID of ingredientIDs) {
          const canMintToken = await management.methods.get_perm_mint(accounts, ingredientID).call();
          if (canMintToken) {
            const data = await axios.get('http://127.0.0.1:4000/api/v1/ingridient/' + ingredientID);

            setTokenOptions(prevProducts => ([
              ...prevProducts,
              {
                id: ingredientID,
                icon: data.data.data[0]?.icon,
                name: data.data.data[0]?.name,
              }
            ]))
          }
        }
      });
    }
  }, [isopen])

  return (
    <Modal
      open={isopen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      aria-labelledby='split-modal-title'
      aria-describedby='split-modal-description'
    >
      <Fade in={isopen}>
        <Box sx={style}>
          <Typography id='split-modal-title' variant='h6' component='h2'>
            Create Token
          </Typography>
          <FormControl component='fieldset' sx={{ mt: 2, width: '100%' }}>
            <InputLabel id="token-id-select-label">Token ID to Mint</InputLabel>
            <Select
              labelId="token-id-select-label"
              id="tokenidtomint"
              value={tokenIdToMint}
              label="Token ID to Mint"
              onChange={handleTokenIdToMintChange}
            >
              {tokenOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component='fieldset' sx={{ mt: 2, width: '100%' }}>
            <FormLabel component='legend'>Select Amount Value (in KG)</FormLabel>
            <TextField
              fullWidth
              placeholder="Token Quantity"
              variant="outlined"
              value={tokenQuantity}
              onChange={handleTokenQuantity}
            />
          </FormControl>
          <Button variant='contained' sx={{ mt: 2 }} onClick={mintToken}>
            Create Token
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MintModal;
