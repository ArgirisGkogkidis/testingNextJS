import React from 'react'
import { v4 as uuid } from 'uuid';
import { Grid, Pagination } from '@mui/material';
import { PackCard } from '../ingridients/pack-card';
import usePagination from '../../utils/usePagination';

export const UserPacks = (props) => {

  const { tracking, accounts } = props
  const [packData, setPackData] = React.useState([{
    id: uuid(),
    ref: 'CDD1049',
    tokensUsed: 0,
    tokens: [],
    meta: {
      name: 'Pack',
      image: '/static/images/products/salad.png'
    }
  },])

  let [page, setPage] = React.useState(1)
  const PER_PAGE = 12

  const count = Math.ceil(packData.length / PER_PAGE)
  const _DATA = usePagination(packData, PER_PAGE)

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  React.useEffect(() => {
    setPackData([])
    initData()
  }, [])

  async function initData() {//tokenHash, ingridientID, blockNumber) {
    // const data = await axios.get('http://127.0.0.1:4000/api/v1/events/mint/'+accounts)
    // console.log(data)
    const userPacks = await tracking.methods.getUserPacks(accounts).call()

    // const tknD = [] //await tracking.methods.getTokenData(ingridientID, tokenHash).call()
    // const { timestamp } = await props.web3.eth.getBlock(15062748).then(result => result);

    // userTokens.forEach((uToken) =>
    for (let uPack of userPacks) {
      if (uPack == '0x0000000000000000000000000000000000000000000000000000000000000000') {
        continue
      }
      const tknD = await tracking.methods.viewPack(uPack).call()
      console.log(tknD)
     
      setPackData(prevPermisions => ([
        ...prevPermisions,
        {
          id: uuid(),
          ref: uPack,
          tokensUsed: tknD[0],
          tokens: tknD[2],
          meta: {
            name: 'Pack',
            image: '/static/images/products/salad.png'
          }
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
          <PackCard product={product} props />
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
