import React from 'react'
import Link from 'next/link'
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
import ingridients from '../../utils/ingridients'

// class Dapp extends React.Component {
const Dapp = (props) => {
    const [userEthAddress, setUserEthAddress] = React.useState('');
    const [userIngredient, setUserIngredient] = React.useState(0)
    const [permisions, setPermisions] = React.useState([])
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center'
    });
    const [allIngridients, setAllMemeImages] = React.useState(ingridients)

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

    async function runCheck() {
        // storeValue()
        const { accounts, management, tracking } = props

        if (!userEthAddress) {
            setSnackBarMessage("Set an Ethereum Address to check")
            setState({
                open: true,
                vertical: 'top',
                horizontal: 'center'
            });
            return;
        }
        if (!props.web3.utils.isAddress(userEthAddress)) {
            setSnackBarMessage("Set a valid Ethereum Address to check")
            setState({
                open: true,
                vertical: 'top',
                horizontal: 'center'
            });
            return;
        }

        setPermisions([])
        if (!userIngredient) {
            // need check for the length of the address
            for (let ingredient of allIngridients.data.ingridients) {
                const ingredientID = ingredient.id

                const obj = {
                    ingredient
                }
                setPermisions(prevPermisions => ([
                    ...prevPermisions,
                    obj
                ]))
            }
        }
        else {
            if (userIngredient <= 0) {
                setSnackBarMessage("Set a non negative ingredient ID")
                setState({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center'
                });
                return;
            }
            if (userIngredient > allIngridients.data.ingridients.length) {
                setSnackBarMessage("Set a known ingredient ID")
                setState({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center'
                });
                return;
            }
            const ingredientID = userIngredient
            const ingredient = allIngridients.data.ingridients[ingredientID - 1]
            const obj = {
                ingredient
            }

            setPermisions(prevPermisions => ([
                ...prevPermisions,
                obj
            ]))
        }
    }

    const renderedUserPerms = Object.values(permisions).map((perms) => {
        perms["ingredientID"] = perms.ingredient.id
        perms["address"] = userEthAddress
        perms["managementContract"] = props.management
        perms["account"] = props.accounts
        return (
            <UserPerms {...perms} key={perms.ingredient.id} />
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
                                <Box
                                    sx={{
                                        maxWidth: 500,

                                    }} >
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
                                    {userEthAddress}
                                </Box>
                                <Box sx={{ maxWidth: 500 }}>

                                    <TextField
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SvgIcon
                                                        fontSize="small"
                                                        color="action"
                                                    >
                                                        <SearchIcon />
                                                    </SvgIcon>
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Ingridient ID"
                                        variant="outlined"
                                        value={userIngredient}
                                        onChange={handleIngredientChange}
                                    />
                                    {userIngredient}
                                </Box>
                                <Box sx={{ maxWidth: 500 }}>

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
                <Box sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    mt: 3
                }}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
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