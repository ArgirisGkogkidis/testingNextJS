import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';
import { Download as DownloadIcon } from '../../icons/download';
import { format } from 'date-fns';
import Link from 'next/link'
import { SeverityPill } from '../severity-pill';

export const PackCard = ({ product, props, ...rest }) => (
    <Card
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}
        {...rest}
    >
        <CardContent>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 3
                }}
            >
                <Avatar
                    alt={product.meta.name}
                    src={product.meta.image}
                    variant="square"
                />
            </Box>
            <Typography
                align="center"
                color="textPrimary"
                gutterBottom
                variant="h5"
            >
                {product.meta.name}
            </Typography>
            <Typography
                align="center"
                color="textPrimary"
                variant="body1"
            >
                Ποσότητα: {product.tokensUsed}<br></br>
            </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Box sx={{ p: 2 }}>
            <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'space-between' }}
            >
                <Grid
                    item
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    <DownloadIcon color="action" />
                    <Link href={{ pathname: '/viewpack/' + product.ref, props }}> View</Link>
                </Grid>
            </Grid>
        </Box>
    </Card>
);

PackCard.propTypes = {
    product: PropTypes.object.isRequired
};
