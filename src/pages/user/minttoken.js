import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import {
  Box, Button,
  Card,
  CardContent, Container, TextField,
  Typography,
  Snackbar, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import axios from 'axios'

const MintToken = (props) => {
  const { tracking, accounts, management } = props
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

  const handleTokenIdToMintChange = (event) => {
    setTokenIdToMint(event.target.value);
  };
  function handleTokenQuantity(event) {
    const { value } = event.target
    setTokenQuantity(value)
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
    const rs = await tracking.methods.mint_token(tokenIdToMint, tokenQuantity).send({ from: accounts });
    console.log(rs);
    // const tokenHash = rs.events.TokenMinted.returnValues.tokenHash
    // console.log(tokenHash)

    // const tokenData = await tracking.methods.getTokenData(tokenHash).call()
    // console.log(tokenData)
    setSnackBarMessage("Token created successfully")
    setState({
      open: true,
      vertical: 'top',
      horizontal: 'center'
    });
  }

  useEffect(async () => {
    await management.methods.getIngredientIDs().call().then(async ingredientIDs => {
      for (const ingredientID of ingredientIDs) {
        const canMintToken = await management.methods.get_perm_mint(accounts, ingredientID).call();
        if (canMintToken) {
          const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/` + ingredientID);

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
  }, [])

  return (
    <>
      <Head>
        <title>
          Mint Token | Blockchain Food Supply
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

          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            Mint Token
          </Typography>
          <Box sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mt: 3
          }}>
            <Card>
              <CardContent>
                <Box sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                  flexWrap: 'wrap'
                }}
                  component="form"
                  noValidate
                  autoComplete="off"
                >

                  <FormControl fullWidth>
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


                  <TextField
                    fullWidth
                    placeholder="Token Quantity"
                    variant="outlined"
                    value={tokenQuantity}
                    onChange={handleTokenQuantity}
                  />
                  {tokenQuantity}

                  <Box sx={{ maxWidth: 500 }}>

                    <Button
                      color="primary"
                      variant="contained"
                      onClick={mintToken}
                    >
                      Mint
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box >
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={snackBarMessage}
        key={vertical + horizontal}
      />
    </>
  )
}

export default MintToken;
