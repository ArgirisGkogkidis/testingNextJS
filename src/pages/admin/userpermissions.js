import React from 'react'
import axios from 'axios'
import {
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Snackbar from '@mui/material/Snackbar';
import UserPerms from '../../components/admin/user-permisions'

const Dapp = (props) => {
  const { management, accounts } = props;
  const [userEthAddress, setUserEthAddress] = React.useState('');
  const [userIngredient, setUserIngredient] = React.useState(0)
  const [permisions, setPermisions] = React.useState([])
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });

  const { vertical, horizontal, open } = state;
  const [snackBarMessage, setSnackBarMessage] = React.useState("a dummy message");

  const handleClose = () => {
    setState({
      open: false, vertical: 'top',
      horizontal: 'center'
    });
  };
  const handleChange = (event) => {
    setUserEthAddress(event.target.value);
  };

  const handlePaste = (event) => {
    setUserEthAddress(event.target.value);
  };

  function handleIngredientChange(event) {
    const { value } = event.target
    setUserIngredient(value)
  }

  async function storeValue() {
    const { accounts, management, tracking } = props
    // await management.methods.set(5).send({ from: accounts[0] })
    await tracking.methods.set_management_sc(management.options.address).send({ from: accounts });
  };

  async function getEthBalance() {
    const { web3, accounts } = props
    const balanceInWei = await web3.eth.getBalance(accounts)
    setState({ ethBalance: balanceInWei / 1e18 })
  };

  function runCheck() {
    // storeValue()
    const { web3 } = props
    setPermisions([])
    if (!userEthAddress) {
      setSnackBarMessage("Set an Ethereum Address to check")
      setState({
        open: true,
        vertical: 'top',
        horizontal: 'center'
      });
      return;
    }
    if (!web3.utils.isAddress(userEthAddress)) {
      setSnackBarMessage("Set a valid Ethereum Address to check")
      setState({
        open: true,
        vertical: 'top',
        horizontal: 'center'
      });
      return;
    }
    setTimeout(async () => {
      await management.methods.getIngredientIDs().call().then(async ingredientIDs => {
        for (const ingredientID of ingredientIDs) {

          const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/` + ingredientID);

          setPermisions(prevProducts => ([
            ...prevProducts,
            {
              id: ingredientID,
              icon: data.data.data[0]?.icon,
              name: data.data.data[0]?.name,
            }
          ]))
        }
      });
      // if (!userIngredient) {
      //   setPermisions(ingridients.data.ingredient)
      // }
    }, 1000);
  }

  const renderedUserPerms = Object.values(permisions).map((ingr) => {
    const perms = {}

    perms["address"] = userEthAddress
    perms["managementContract"] = props.management
    perms["account"] = props.accounts
    return (
      <UserPerms {...perms}
        ingridient={ingr}
        key={ingr.id} />
    )
  })

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            Manage User permissions
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between', // This will push the child elements to the edges
                alignItems: 'center', // Vertically align items in the middle
                width: '100%', // Ensure the Box takes the full width
              }}
                component="form"
                noValidate
                autoComplete="off"
              >
                <Box
                  sx={{ flexGrow: 1, mr: 1 }} >
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <AccountCircle />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    label="User Eth Address"
                    variant="outlined"
                    id="userethaddress"
                    value={userEthAddress}
                    onChange={handleChange}
                    onPaste={handlePaste}
                  />
                </Box>
                <Box>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={runCheck}
                  >
                    Search
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {renderedUserPerms}
          </Grid>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={snackBarMessage}
        key={vertical + horizontal}
      />
    </Box >
  )

}

export default Dapp;
