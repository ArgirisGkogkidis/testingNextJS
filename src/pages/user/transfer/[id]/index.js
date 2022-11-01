import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import {
    Box, Button,
    Card, CardContent,
    Container, Typography,
    NativeSelect
} from '@mui/material';
import { useRouter } from 'next/router'
import axios from 'axios'
import { v4 as uuid } from 'uuid';



const TransferToken = (props) => {

    const router = useRouter()
    const { tracking, accounts } = props
    const [receiverAddress, setReceiverAddress] = useState("")
    const { id } = router.query

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        setReceiverAddress(value);
    };

    const [userData, setUserData] = useState([{
        id: uuid(),
        wallet: '0x000000000000000000000000000000',
        fullName: 'John Doe',
        lastName: 'Doe'
    },])


    async function transferToken() {
        if (!accounts) {
            alert("Need an Ethereum address to check")
            return;
        }

        const rs = await tracking.methods.transfer_token(0, id, receiverAddress).send({ from: accounts });
    }

    async function initData() {
        const data = await axios.get('https://blockchainbackendserver.herokuapp.com/api/v1/users')
        const dt = { ...data.data.data.data }
        for (let i in dt) {
            setUserData(prevPermisions => ([
                ...prevPermisions,
                {
                    id: uuid(),
                    wallet: dt[i].wallet,
                    fullName: dt[i].firstName + ` ` + dt[i].lastName,
                    lastName: dt[i].lastName
                }
            ]))
        }
    }

    useEffect(() => {
        setUserData([])
        initData()
    }, [])
    // https://blockchainbackendserver.herokuapp.com/api/v1/users

    return (
        <>
            <Head>
                <title>
                    Transfer Token | Blockchain Food Supply
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
                        Transfer Token
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
                                    <Box sx={{ maxWidth: 500 }}>
                                        <NativeSelect
                                            inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native',
                                            }}
                                            onChange={handleChange}
                                        >
                                            {userData.map((user) => (
                                                <option value={user.wallet}>{user.fullName}</option>
                                            ))}
                                        </NativeSelect>
                                    </Box>
                                    <Box sx={{ maxWidth: 500 }}>

                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={transferToken}
                                        >
                                            Transfer
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box >
        </>
    )
}

export default TransferToken;