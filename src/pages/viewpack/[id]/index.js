
import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router'
import {
    Box, Container,
    Typography, Grid, Pagination
} from '@mui/material';
import usePagination from '../../../utils/usePagination';
import ingridients from '../../../utils/ingredients'
import { PackIngridientCard } from '../../../components/ingridients/packIngridient-card';
import { v4 as uuid } from 'uuid';
import axios from 'axios'

const ViewPackGeneral = (props) => {
    const { tracking, accounts } = props
    const router = useRouter()
    const { id } = router.query
    const tokenHash = id

    const [tokenData, setTokenData] = useState([])

    let [page, setPage] = React.useState(1)
    const PER_PAGE = 12

    const count = Math.ceil(tokenData.length / PER_PAGE)
    const _DATA = usePagination(tokenData, PER_PAGE)

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        setTokenData([])
        generateSnacks()
    }, [])

    async function generateSnacks() {
        const packData = await tracking.methods.viewPack(id).call()

        for (let i = 0; i < packData[0]; i++) {

            const tknD = await tracking.methods.getTokenData(packData[1][i]).call()
            const pastHolders = await tracking.methods.getTokenPastHolders(packData[1][i]).call()

            console.log(pastHolders)
            const holdersName = ''
            for(let i in pastHolders)
            {
                let pastHolder = pastHolders[i]
                console.log(pastHolder)
                const data = await axios.get('http://localhost:4000/api/v1/', { params: { wallet: pastHolder } });
                const user = data.data.data.user[0]
                holdersName = user.firstName + " " + user.lastName + ',' + holdersName
            }

            const data = await axios.get('http://localhost:4000/api/v1/', { params: { wallet: tknD[3] } });
            const user = data.data.data.user[0]
            const userName = user.firstName + " " + user.lastName

            setTokenData(prevPermisions => ([
                ...prevPermisions,
                {
                    id: uuid(),
                    tokenID: tknD[0],
                    tokenStatus: tknD[1] == 1 ? 'ready' : (tknD[1] == 2 ? 'pending' : 'packed'),
                    tokenQuantity: tknD[2],
                    tokenHolder: userName,
                    tokenPendingHolder: tknD[4],
                    tokenPreviousHoldersLength: tknD[5],
                    meta: {
                        name: ingridients.data.ingredient[tknD[0] - 1].name,
                        image: ingridients.data.ingredient[tknD[0] - 1].image
                    },
                    createdAt: Number(tknD[6] * 1000),
                    pastHoldersNames: holdersName
                }]))

        }
    }

    return (
        <>
            <Head>
                <title>
                    View Pack Token | Blockchain Food Supply
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
                        View Pack ({id})
                    </Typography>
                    <Box sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        mt: 3
                    }}>
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
                                    <PackIngridientCard product={product} props />
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
                    </Box>
                </Container>
            </Box >
        </>
    )
}

export default ViewPackGeneral
