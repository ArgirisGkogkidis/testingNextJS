import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, Box, Avatar, Typography, Divider, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClockIcon from '@mui/icons-material/AccessTime'; // Adjust as needed
import { SeverityPill } from 'src/components/severity-pill';


export const PackIngredientCard = ({ product, ...rest }) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
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
                    Quantity: {product.amount}<br />
                    Factory: {product.customer.name}<br />
                    Status: <SeverityPill
                        color={(product.status === 'ready' && 'success')
                            || (product.status === 'packed' && 'error')
                            || 'warning'}
                    >
                        {product.status}
                    </SeverityPill>
                </Typography>
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
                            {product.pastHoldersNames || 'N/A'}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Typography
                    color="textSecondary"
                    display="inline"
                    sx={{ pl: 1, mt: 2 }}
                    variant="body2"
                >
                    <ClockIcon color="action" />
                    Created: {format(new Date(product.createdAt), 'HH:mm:ss dd/MM/yyyy')}
                </Typography>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
        </Card>
    </Grid>
);
