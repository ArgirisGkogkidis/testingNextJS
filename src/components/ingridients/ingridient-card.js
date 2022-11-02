import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';
import { Download as DownloadIcon } from '../../icons/download';
import { format } from 'date-fns';
import Link from 'next/link'
import { SeverityPill } from '../severity-pill';

export const IngridientCard = ({ product, props, ...rest }) => (
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
                Ποσότητα: {product.amount}<br></br>
                Κατάσταση: <SeverityPill
                    color={(product.status === 'ready' && 'success')
                        || (product.status === 'packed' && 'error')
                        || 'warning'}
                >
                    {product.status}
                </SeverityPill>
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
                    <ClockIcon color="action" />
                    <Typography
                        color="textSecondary"
                        display="inline"
                        sx={{ pl: 1 }}
                        variant="body2"
                    >
                        Δημιουργήθηκε: {format(product.createdAt, 'HH:mm:ss dd/MM/yyyy')}
                    </Typography>
                </Grid>
                <Grid
                    item
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    <DownloadIcon color="action" />
                    <Link href={{ pathname: '/user/split/' + product.ref, props }}> Split</Link>
                </Grid>
                <Grid
                    item
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    <DownloadIcon color="action" />
                    <Link href={{ pathname: '/user/transfer/' + product.ref, props }}> Transfer</Link>
                </Grid>
            </Grid>
        </Box>
    </Card>
);

IngridientCard.propTypes = {
    product: PropTypes.object.isRequired
};
