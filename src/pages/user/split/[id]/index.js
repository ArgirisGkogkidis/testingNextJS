
import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router'
import {
    Box, Button,
    Card,
    CardContent, Container, Slider,
    Typography
} from '@mui/material';

const TokenToReceive = (props) => {
    const { tracking, accounts } = props
    const router = useRouter()
    const { id } = router.query
    const tokenHash = id

    const [value, setValue] = useState(1);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };
    const [tokenData, setTokenData] = useState({
        tokenID: 0,
        tokenStatus: 0,
        tokenQuantity: 0,
        tokenHolder: '',
        tokenPendingHolder: '',
        tokenPreviousHoldersLength: 0
    })

    async function splitToken() {
        if (!accounts) {
            alert("Need an Ethereum address to check")
            return;
        }

        // await contract.methods.mint_token(tokenIdToMint, tokenQuantity).send({ from: props.account });
        const rs = await tracking.methods.split_token(tokenData.tokenID, id, value).send({ from: accounts });
        console.log(rs);
    }

    useEffect(() => {
        generateSnacks()
    }, [])

    async function generateSnacks() {

        const tknD = await tracking.methods.getTokenData(tokenHash).call()
        /*
            tkn.ingridientID,
            tkn.status,
            tkn.amount,
            tkn.holder,
            tkn.pending_holder,
            tkn.past_holders_length,
            tkn.minted_on
        */
        setTokenData({
            tokenID: tknD[0],
            tokenStatus: tknD[1],
            tokenQuantity: tknD[2],
            tokenHolder: tknD[3],
            tokenPendingHolder: tknD[4],
            tokenPreviousHoldersLength: tknD[5]
        })
    }

    return (
        <>
            <Head>
                <title>
                    Split Token | Blockchain Food Supply
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
                        Διαμοιρασμός ({id})
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
                                >
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography
                                            color="textPrimary"
                                            gutterBottom
                                            variant="body2"
                                        >
                                            Token Status: {' '} {tokenData.tokenStatus}
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            gutterBottom
                                            variant="body2"
                                        >
                                            Ποσότητα: {' '} {tokenData.tokenQuantity}
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            gutterBottom
                                            variant="body2"
                                        >
                                            Νέα Ποσότητα: {' '} {value}
                                        </Typography>
                                        <Slider
                                            defaultValue={tokenData.tokenQuantity / 2}
                                            min={1}
                                            max={tokenData.tokenQuantity - 1}
                                            onChange={handleSliderChange}
                                            aria-label="Default"
                                            valueLabelDisplay="on" />
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={splitToken}
                                        >
                                            Διαμοιρασμός
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

export default TokenToReceive
