import React from 'react'
import { v4 as uuid } from 'uuid';
import { Grid, Pagination } from '@mui/material';
import ingridients from '../../utils/ingridients'
import { IngridientCard } from '../ingridients/ingridient-card';
import usePagination from '../../utils/usePagination';

export const LatestTokens = (props) => {

  const { tracking, accounts } = props
  const [tokenData, setTokenData] = React.useState([{
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    meta: {
      name: 'Ekaterina Tankova',
      image: ''
    },
    createdAt: 1555016400000,
    status: 'pending'
  },])

  let [page, setPage] = React.useState(1)
  const PER_PAGE = 3

  const count = Math.ceil(tokenData.length / PER_PAGE)
  const _DATA = usePagination(tokenData, PER_PAGE)

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

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
          meta: {
            name: ingridients.data.ingridients[tknD[0] - 1].name,
            image: ingridients.data.ingridients[tknD[0] - 1].image
          },
          createdAt: Number(tknD[6] * 1000),
          status: tknD[1] == 1 ? 'ready' : (tknD[1] == 2 ? 'pending' : 'packed')
        }
      ]))
    }

  }

  return (
    <>
      <Grid
        container
        spacing={3}
        justify="flex-start"
        alignItems="center"
      >
        {_DATA.currentData().map((product) => (
        <Grid
          item
          key={product.id}
          lg={4}
          md={6}
          xs={12}
        >
          <IngridientCard product={product} props />
        </Grid>
      ))}
      
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Grid>
    </>
  )
};
