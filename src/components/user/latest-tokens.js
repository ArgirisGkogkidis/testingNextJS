import React from 'react'
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';
import ingridients from '../../utils/ingridients'


export const LatestTokens = (props) => {

  const { tracking, accounts } = props
  const [tokenData, setTokenData] = React.useState([{
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },])
  let idCounter = 0;

  React.useEffect(() => {
    setTokenData([])
    idCounter = 0
    const results2 = tracking.events._exposeMintedTokenHash({ fromBlock: 0, toBlock: 'latest' }, function (err, result) {
      if (err) {
        console.log(err)
        return;
      }
      // console.log('rs')
      // console.log(result)
      const owner = result.returnValues.owner
      const tokenHash = result.returnValues.tokenhash
      const ingridientID = result.returnValues._ingridientID

      if (accounts === owner) {
        initData(tokenHash, ingridientID, result.blockNumber)
      }
    })

  }, [])

  async function initData(tokenHash, ingridientID, blockNumber) {
    const tknD = await tracking.methods.getTokenData(ingridientID, tokenHash).call()

    const { timestamp } = await props.web3.eth.getBlock(blockNumber).then(result => result);
    if (tknD[2] === accounts && idCounter <= 8) {
      setTokenData(prevPermisions => ([
        ...prevPermisions,
        {
          id: uuid(),
          ref: tokenHash,
          amount: tknD[1],
          customer: {
            name: ingridients.data.ingridients[ingridientID].name
          },
          createdAt: timestamp * 1000,
          status: tknD[0] == 1 ? 'ready' : (tknD[0] == 2 ? 'pending' : 'packed')
        }
      ]))
      idCounter += 1
    }
  }

  return (
    <Card {...props}>
      <CardHeader title="Latest Tokens" />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 100 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Token Hash
                </TableCell>
                <TableCell>
                  Token Type
                </TableCell>
                <TableCell>
                  Token Quantity
                </TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip
                    enterDelay={300}
                    title="Sort"
                  >
                    <TableSortLabel
                      active
                      direction="desc"
                    >
                      Date Minted
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokenData.map((order) => (
                <TableRow
                  hover
                  key={order.id}
                >
                  <TableCell>
                    {order.ref}
                  </TableCell>
                  <TableCell>
                    {order.customer.name}
                  </TableCell>
                  <TableCell>
                    {order.amount}
                  </TableCell>
                  <TableCell>
                    {format(order.createdAt, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <SeverityPill
                      color={(order.status === 'ready' && 'success')
                        || (order.status === 'packed' && 'error')
                        || 'warning'}
                    >
                      {order.status}
                    </SeverityPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  )
};
