import React from 'react'
import {
  Box, Button,
  Container, List,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';

import axios from 'axios'
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


const PendingTokens = (props) => {
  const { tracking, accounts } = props
  const [tokenData, setTokenData] = React.useState([])
  const [dataRows, setDataRows] = React.useState([])
  const [pageSize, setPageSize] = React.useState(5);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  let idCounter = 0;

  React.useEffect(() => {

    // const results2 = tracking.events._eTransferToken({ fromBlock: 0, toBlock: 'latest' }, function (err, result) {
    //   if (err) {
    //     console.log(err)
    //     return;
    //   }

    //   const owner = result.returnValues._receiver
    //   const tokenHash = result.returnValues._tokenHash
    //   const ingridientID = result.returnValues._ingridientID

    //   if (accounts === owner) {
    //     initData(tokenHash, ingridientID)
    //   }
    // })
    fetchTokens()

  }, [])

  const milligramsToKilograms = (milligrams) => milligrams / 1e6;

  const fetchTokens = async () => {
    setTokenData([])
    setDataRows([])
    setLoading(true)
    idCounter = 0; // Reset counter
    await tracking.methods.getUserPendingTokens(accounts).call().then(async results => {
      console.log(results);
      for (const result of results) {
        // Skip if the result is the zero address
        if (result === "0x0000000000000000000000000000000000000000000000000000000000000000") {
          continue; // Skip this iteration and continue with the next loop iteration
        }
        await initData(result);
      }
    });
    setLoading(false)
  };

  async function initData(tokenHash) {
    console.log("request for:", tokenHash)
    const tknD = await tracking.methods.getTokenData(tokenHash).call().then(async (token) => {
      console.log("Received token data")
      console.log(token)
      if (Number(token[1]) == 2) {
        setTokenData(prevPermisions => ([
          ...prevPermisions,
          {
            tokenHash: tokenHash,
            ingridientID: token[0]
          }
        ]))
        idCounter += 1

        const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`, { params: { wallet: token[3] } });
        const user = data.data.data.user[0]
        const userName = user.firstName + " " + user.lastName
        setDataRows((previousRow) => [...previousRow, { id: idCounter, tokenhash: tokenHash, tokenid: token[0], tokensender: userName, tokenquantity: milligramsToKilograms(token[2]) }])
        console.log(dataRows)
      }
    })
  }

  async function acceptToken() {
    if (!accounts) {
      alert("Need an Ethereum address to check")
      return;
    }

    const _tokenHashes = []

    for (let posID in selectionModel) {
      const tokenHash = dataRows[posID].tokenhash

      _tokenHashes.push(tokenHash)
    }
    console.log(_tokenHashes)

    // const ingridientID = props.token.ingridientID
    // const tokenHash = props.token.tokenHash
    const rs = null
    rs = await tracking.methods.receive_tokens(_tokenHashes).send({ from: accounts });

    console.log("result", rs)
    fetchTokens()
    props.onTokenAccepted();
  }

  return (
    <>
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
            {selectionModel.length > 0 ? (
              <>
                <Tooltip title="Delete">
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>

                </Tooltip>
                <Tooltip title="Add">
                  <IconButton onClick={acceptToken} >
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

export default PendingTokens;
