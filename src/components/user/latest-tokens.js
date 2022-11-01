import React from 'react'
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  CardHeader,
  Typography
} from '@mui/material';
import { SeverityPill } from '../severity-pill';
import ingridients from '../../utils/ingridients'
import Link from 'next/link'

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

  React.useEffect(() => {
    setTokenData([])

    initData()
  }, [])

  async function initData() {//tokenHash, ingridientID, blockNumber) {
    // const data = await axios.get('http://127.0.0.1:4000/api/v1/events/mint/'+accounts)
    // console.log(data)
    const userTokens = await tracking.methods.getUserTokens(accounts).call()

    // const tknD = [] //await tracking.methods.getTokenData(ingridientID, tokenHash).call()
    // const { timestamp } = await props.web3.eth.getBlock(15062748).then(result => result);

    // userTokens.forEach((uToken) =>
    for (let uToken of userTokens) {
      if (uToken == '0x0000000000000000000000000000000000000000000000000000000000000000') {
        continue
      }
      const tknD = await tracking.methods.getTokenData(uToken).call()
      if (tknD[3] === accounts)
        console.log(tknD)
      setTokenData(prevPermisions => ([
        ...prevPermisions,
        {
          id: uuid(),
          ref: uToken,
          amount: tknD[2],
          customer: {
            name: ingridients.data.ingridients[tknD[0]].name
          },
          createdAt: Number(tknD[6] * 1000),
          status: tknD[1] == 1 ? 'ready' : (tknD[1] == 2 ? 'pending' : 'packed')
        }
      ]))
    }

  }

  const [open, setOpen] = React.useState(false);

  function openFromParent() {
    setOpen(true);
  }

  function handleCloseModal(event, data) {
    console.log(event, data);
    setOpen(false);
  }

  return (
    <>{tokenData.map((order) => (
      <Grid
        item
        xs={12}
        md={3}
        lg={4}
        xl={4}
        key={order.id}
      >
        <Card {...props} sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="tomato"
            height="140"
            image="https://cdn-icons-png.flaticon.com/512/1202/1202125.png?w=164&h=164&fit=crop&auto=format"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {order.customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.ref}<br></br>
              Ποσότητα: {order.amount}<br></br>
              Δημιουργήθηκε : {format(order.createdAt, 'HH:mm:ss dd/MM/yyyy')}<br></br>
              Κατάσταση:
              <SeverityPill
                color={(order.status === 'ready' && 'success')
                  || (order.status === 'packed' && 'error')
                  || 'warning'}
              >
                {order.status}
              </SeverityPill>

            </Typography>
          </CardContent>
          <CardActions>
            <Link href={{ pathname: '/user/split/' + order.ref, props }}> Split</Link>
            {/* <Button size="small" >Transfer</Button> */}
            <Link href={{ pathname: '/user/transfer/' + order.ref, props }}> Transfer</Link>
          </CardActions>
        </Card>
      </Grid>
    ))}
    </>
  )
};
