import React from 'react'
import Head from 'next/head';
import {
    Box, Button,
    Card,
    CardContent, Container, TextField,
    Typography
} from '@mui/material';


const TransferToken = (props) => {
    console.log(props)
    const { tracking, accounts } = props
    const [tokenIdToTransfer, setTokenIdToTransfer] = React.useState("")
    const [tokenIdToMint, setTokenIdToMint] = React.useState("")
    const [tokenQuantity, setTokenQuantity] = React.useState("")

    function handleTokenIdToTransfer(event) {
        const { value } = event.target
        setTokenIdToTransfer(value)
    }
    function handleTokenIdToMint(event) {
        const { value } = event.target
        setTokenIdToMint(value)
    }
    function handleTokenQuantity(event) {
        const { value } = event.target
        setTokenQuantity(value)
    }

    async function transferToken() {
        if (!accounts) {
            alert("Need an Ethereum address to check")
            return;
        }

        const rs = await tracking.methods.transfer_token(tokenIdToTransfer,tokenIdToMint, tokenQuantity).send({ from: accounts });
    }

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
                                    <Box
                                        sx={{
                                            maxWidth: 500,

                                        }} >
                                        <TextField
                                            fullWidth
                                            label="Token Id To Transfer"
                                            variant="outlined"
                                            id="tokenIdToTransfer"
                                            value={tokenIdToTransfer}
                                            onChange={handleTokenIdToTransfer}
                                        />
                                        {tokenIdToTransfer}
                                    </Box>
                                    <Box
                                        sx={{
                                            maxWidth: 500,

                                        }} >
                                        <TextField
                                            fullWidth
                                            label="Token hash"
                                            variant="outlined"
                                            id="tokenidtomint"
                                            value={tokenIdToMint}
                                            onChange={handleTokenIdToMint}
                                        />
                                        {tokenIdToMint}
                                    </Box>
                                    <Box sx={{ maxWidth: 500 }}>

                                        <TextField
                                            fullWidth
                                            placeholder="Receiver address"
                                            variant="outlined"
                                            value={tokenQuantity}
                                            onChange={handleTokenQuantity}
                                        />
                                        {tokenQuantity}
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