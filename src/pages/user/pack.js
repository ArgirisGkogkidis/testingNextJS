import React from 'react'
import Head from 'next/head';
import {
    Box,
    Container,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../../icons/norowoverlay'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios'

const dataColumns = [
    { field: 'id' },
    { field: 'tokenid', width: 80, type: 'number' },
    { field: 'tokenhash', width: 150 },
    { field: 'tokensender', width: 150 },
    { field: 'tokenquantity', width: 150, type: 'number' },
];

const PackToken = (props) => {

    const { tracking, accounts } = props
    const [tokenIdToMint, setTokenIdToMint] = React.useState("")
    const [tokenQuantity, setTokenQuantity] = React.useState("")

    const [tokenData, setTokenData] = React.useState([])
    const [dataRows, setDataRows] = React.useState([])
    const [pageSize, setPageSize] = React.useState(5);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    let idCounter = 0;

    React.useEffect(() => {
        console.log(props)
        setTokenData([])
        setDataRows([])
        setLoading(true)
        idCounter = 0
        initData()
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }, [])

    async function initData() {

        const pendingTokens = await tracking.methods.getUserTokens(accounts).call()
        for (let i in pendingTokens) {
            let pendingToken = pendingTokens[i]
            if (pendingToken == '0x0000000000000000000000000000000000000000000000000000000000000000')
                continue
            const tknD = await tracking.methods.getTokenData(pendingToken).call()
            console.log("token data")
            console.log(tknD)
            if (tknD[1] == 1) {
                setTokenData(prevPermisions => ([
                    ...prevPermisions,
                    {
                        tokenHash: pendingToken,
                        ingridientID: tknD[0]
                    }
                ]))
                idCounter += 1

                const data = await axios.get('https://blockchainbackendserver.herokuapp.com/api/v1/', { params: { wallet: tknD[3] } });
                const user = data.data.data.user[0]
                const userName = user.firstName + " " + user.lastName
                setDataRows((previousRow) => [...previousRow, { id: idCounter, tokenhash: pendingToken, tokenid: tknD[0], tokensender: userName, tokenquantity: tknD[1] }])
            }
        }
    }

    async function packTokens() {
        if (!accounts) {
            alert("Need an Ethereum address to check")
            return;
        }

        const _tokenHash = []

        for (let posID in selectionModel) {
            const tokenHash = dataRows[posID].tokenhash
            _tokenHash.push(tokenHash)
        }
        // await contract.methods.mint_token(tokenIdToMint, tokenQuantity).send({ from: props.account });
        const rs = await tracking.methods.pack(_tokenHash, accounts).send({ from: accounts });
        console.log(rs);

        // const packHash = rs.events._exposePackHash.returnValues.packHash
        // console.log("packHash:", packHash)
    }

    return (
        <>
            <Head>
                <title>
                    Pack Token | Blockchain Food Supply
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
                        Pack Tokens
                    </Typography>
                    {/* <Box sx={{
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
                                            label="Token id to mint"
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
                                            placeholder="Token Quantity"
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
                                            onClick={mintToken}
                                        >
                                            Pack
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box> */}
                    <Box sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        mt: 3
                    }}>
                        {/* <List dense={true}>
                            {renderTokensToReceive}
                        </List> */}
                        {selectionModel.length > 0 ? (
                            <>
                                <Tooltip title="Delete">
                                    <IconButton>
                                        <DeleteIcon />
                                    </IconButton>

                                </Tooltip>
                                <Tooltip title="Add">
                                    <IconButton onClick={packTokens} >
                                        <AddCircleIcon />
                                    </IconButton>

                                </Tooltip>
                            </>
                        ) : <>Select Token</>}
                        <div style={{ height: 400, width: '100%' }}>


                            <DataGrid
                                pageSize={pageSize}
                                onSelectionModelChange={(newSelectionModel) => {
                                    setSelectionModel(newSelectionModel);
                                }}
                                selectionModel={selectionModel}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[5, 10, 20]}
                                pagination
                                checkboxSelection
                                disableColumnFilter
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                }}
                                columns={dataColumns}
                                rows={dataRows}
                                sx={{
                                    boxShadow: 2,
                                    border: 2,
                                    borderColor: 'primary.light',
                                    '& .MuiDataGrid-cell:hover': {
                                        color: 'primary.main',
                                    },
                                }}
                                maxColumns={5}
                                loading={loading}
                            />
                        </div>
                    </Box>
                </Container>
            </Box >
        </>
    )
}

export default PackToken;
