import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography,Accordion, AccordionSummary,AccordionDetails  } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';
import { format } from 'date-fns';
import { SeverityPill } from '../severity-pill';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PackIngridientCard = ({ product, props, ...rest }) => (
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
                Ποσότητα: {product.tokenQuantity}<br></br>
                Εργοστάσιο: {product.tokenHolder}<br></br>
                Κατάσταση: <SeverityPill
                    color={(product.tokenStatus === 'ready' && 'success')
                        || (product.tokenStatus === 'packed' && 'error')
                        || 'warning'}
                >
                    {product.tokenStatus}
                </SeverityPill>
            </Typography>
            <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Past Holders</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {product.pastHoldersNames}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
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
            </Grid>
        </Box>
    </Card>
);

PackIngridientCard.propTypes = {
    product: PropTypes.object.isRequired
};
