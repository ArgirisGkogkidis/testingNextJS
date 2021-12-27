import React from 'react'
import Head from 'next/head';
import {
    Box, Button,
    Container, List,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material';

import ReceiveTokenComponent from '../../components/user/receive-token-component'

import { DataGrid } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../../icons/norowoverlay'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const dataColumns = [
    { field: 'id' },
    { field: 'tokenid', width: 80, type: 'number' },
    { field: 'tokenhash', width: 150 },
    { field: 'tokensender', width: 150 },
    { field: 'tokenquantity', width: 150, type: 'number' },
];


const ReceiveToken = (props) => {
    const { tracking, accounts } = props
    const [tokenData, setTokenData] = React.useState([])
    const [dataRows, setDataRows] = React.useState([])
    const [pageSize, setPageSize] = React.useState(5);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    let idCounter = 0;

    React.useEffect(() => {
        setTokenData([])
        setDataRows([])
        setLoading(true)
        idCounter = 0
        const results2 = tracking.events._eTransferToken({ fromBlock: 0, toBlock: 'latest' }, function (err, result) {
            if (err) {
                console.log(err)
                return;
            }

            const owner = result.returnValues._receiver
            const tokenHash = result.returnValues._tokenHash
            const ingridientID = result.returnValues._ingridientID

            if (accounts === owner) {
                initData(tokenHash, ingridientID)
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }, [])

    async function initData(tokenHash, ingridientID) {
        const tknD = await tracking.methods.getTokenData(ingridientID, tokenHash).call()
        console.log("token data")
        console.log(tknD)
        if (tknD[0] == 2) {
            setTokenData(prevPermisions => ([
                ...prevPermisions,
                {
                    tokenHash: tokenHash,
                    ingridientID: ingridientID
                }
            ]))
            idCounter += 1
            setDataRows((previousRow) => [...previousRow, { id: idCounter, tokenhash: tokenHash, tokenid: ingridientID, tokensender: tknD[2], tokenquantity: tknD[1] }])
            console.log(dataRows)
        }

    }

    async function acceptToken() {
        if (!accounts) {
            alert("Need an Ethereum address to check")
            return;
        }
        // for (let posID in selectionModel) {
        //     console.log(dataRows[posID])
        //     const ingridientID = dataRows[posID].id
        //     const tokenHash = dataRows[posID].tokenhash

        //     console.log(ingridientID, tokenHash)
        //     const rs = await tracking.methods.receive_token(ingridientID, tokenHash).send({ from: accounts });
        //     console.log(rs)
        // }

        const _ingridientID = []
        const _tokenHash = []

        for (let posID in selectionModel) {
            const ingridientID = dataRows[posID].id
            const tokenHash = dataRows[posID].tokenhash
            _ingridientID.push(ingridientID)
            _tokenHash.push(tokenHash)
        }
        console.log(_ingridientID)
        console.log(_tokenHash)
        const rs = await tracking.methods.receive_tokens(_ingridientID, _tokenHash).send({ from: accounts });

        // const ingridientID = props.token.ingridientID
        // const tokenHash = props.token.tokenHash
        // const rs = await contract.methods.receive_token(ingridientID, tokenHash).send({ from: props.account });
        console.log(rs)
    }

    const renderTokensToReceive = Object.values(tokenData).map((tkn) => {
        const perms = {}
        perms["token"] = tkn
        perms["contract"] = props.tracking
        perms["account"] = props.accounts
        return (
            <ReceiveTokenComponent {...perms} key={tkn.tokenHash} />
        )
    })

    return (
        <>
            <Head>
                <title>
                    Receive Token | Blockchain Food Supply
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
                        Receive Token
      </Typography>
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
                                    <IconButton>
                                        <AddCircleIcon onClick={acceptToken} />
                                    </IconButton>

                                </Tooltip>
                            </>
                        ) : <>Skata</>}
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

export default ReceiveToken;