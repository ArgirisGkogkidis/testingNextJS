import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClockIcon from '@mui/icons-material/AccessTime'; // Adjust as needed

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const PackIngredientCard = ({ product, ...rest }) => {
  const events = typeof product.pastHolders === 'string' ? product.pastHolders.split('\n') : 'N/A';

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        {...rest}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pb: 3,
            }}
          >
            <Avatar alt={product.meta.name} src={product.meta.image} variant='square' />
          </Box>
          <Typography align='center' color='textPrimary' gutterBottom variant='h5'>
            {product.meta.name}
          </Typography>
          <Typography align='center' color='textPrimary' variant='body1'>
            Quantity: {product.amount}
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography>Past Holders</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Timeline align="left" sx={{ padding: 0, '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}>
                {events.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < events.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant="body2" color="textSecondary">{event}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </AccordionDetails>
          </Accordion>
          {/* <Typography color='textSecondary' display='inline' sx={{ pl: 1, mt: 2 }} variant='body2'>
            <ClockIcon color='action' />
            Created: {format(new Date(product.createdAt), 'HH:mm:ss dd/MM/yyyy')}
          </Typography> */}
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
      </Card>
    </Grid>
  );
}

export default PackIngredientCard;
