
import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Box, Button,
  Card,
  CardContent, Container, TextField,
  Typography
} from '@mui/material';

const TokenToReceive = (props) => {
  const { tracking, accounts } = props
  const router = useRouter()
  const { id } = router.query
  const ingridientID = id.split(":")[1]
  const tokenHash = id.split(":")[0]

  const [tokenData, setTokenData] = useState({
    tokenStatus: 0,
    tokenQuantity: 0,
    tokenHolder: '',
    tokenPendingHolder: '',
    tokenPreviousHoldersLength: 0
  })

  useEffect(() => {
    generateSnacks()
  }, [])

  async function generateSnacks() {

    const tknD = await tracking.methods.getTokenData(tokenHash).call()

    setTokenData({
      tokenStatus: tknD[0],
      tokenQuantity: tknD[1],
      tokenHolder: tknD[2],
      tokenPendingHolder: tknD[3],
      tokenPreviousHoldersLength: tknD[4]
    })
  }

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
            View Token ({id})
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
                      Token Quantity: {' '} {tokenData.tokenQuantity}
                    </Typography>
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="body2"
                    >
                      Token Current Holder: {' '} {tokenData.tokenHolder}
                    </Typography>
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="body2"
                    >
                      Token Pending Holder: {' '} {tokenData.tokenPendingHolder}
                    </Typography>
                    <Button
                      color="primary"
                      variant="contained"
                    >
                      Get Token
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
