import Head from 'next/head';
import { Box, Container, Grid, Button } from '@mui/material';

const Products = (props) => {

    async function storeValue() {
        const { accounts, management, tracking } = props
        // await management.methods.set(5).send({ from: accounts[0] })
        await tracking.methods.set_management_sc(management.options.address).send({ from: accounts });
    };

    function runCheck() {
        storeValue()
    }
    console.log(props)
    return (
        <>
            <Head>
                <title>
                    Fix access settings | Blockchain
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={false}>

                    <Box sx={{ pt: 3 }}>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={runCheck}
                            >
                                Fix me
                            </Button>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

// Products.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default Products;
