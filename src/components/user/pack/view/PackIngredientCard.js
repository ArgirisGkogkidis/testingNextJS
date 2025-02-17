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
  useTheme,

  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClockIcon from '@mui/icons-material/AccessTime'; // Adjust as needed

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import ThermostatIcon from '@mui/icons-material/Thermostat'; // For temperature
import OpacityIcon from '@mui/icons-material/Opacity'; // For humidity

import MinimizeIcon from '@mui/icons-material/Minimize'; // For minimum values
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // For maximum values
import AvTimerIcon from '@mui/icons-material/AvTimer'; // For average values

// Define a separate component for each measurement section for cleaner code
function MeasurementSection({ icon, title, min, max, avg }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
      {icon}
      <Typography variant='body1' sx={{ mx: 1, fontWeight: 'medium' }}>
        {title}
      </Typography>
      <Typography variant='body2' color='textSecondary' sx={{ flexGrow: 1 }}>
        <MinimizeIcon fontSize='small' /> Min: {min.toFixed(2)}
      </Typography>
      <Typography variant='body2' color='textSecondary' sx={{ flexGrow: 1 }}>
        <ExpandLessIcon fontSize='small' /> Max: {max.toFixed(2)}
      </Typography>
      <Typography variant='body2' color='textSecondary' sx={{ flexGrow: 1 }}>
        <AvTimerIcon fontSize='small' /> Avg: {avg.toFixed(2)}
      </Typography>
    </Box>
  );
}

const PackIngredientCard = ({ product, ...rest }) => {
  const theme = useTheme();
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
              <Timeline
                align='left'
                sx={{ padding: 0, '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}
              >
                {events.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color='primary' />
                      {index < events.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant='body2' color='textSecondary'>
                        {event}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </AccordionDetails>
          </Accordion>

          {/* Measurements Accordion */}
          {/* <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel-measurements-content'
              id='panel-measurements-header'
            >
              <Typography>Measurements 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {product.measurements.map((measurement, index) => (
                  <Grid item xs={12} sm={12} key={index}>
                    <Card variant='outlined'>
                      <CardContent>
                        <Typography variant='h6' component='h2' gutterBottom>
                          {measurement.stage}
                        </Typography>
                        <Typography color='textSecondary' display='flex' alignItems='center'>
                          <ThermostatIcon
                            color='primary'
                            style={{ marginRight: theme.spacing(1) }}
                          />
                          Temperature: {measurement.temp_min.toFixed(2)}°C -{' '}
                          {measurement.temp_max.toFixed(2)}°C
                        </Typography>
                        <Typography color='textSecondary' display='flex' alignItems='center'>
                          <OpacityIcon color='primary' style={{ marginRight: theme.spacing(1) }} />
                          Humidity: {measurement.hum_min.toFixed(2)}% -{' '}
                          {measurement.hum_max.toFixed(2)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion> */}

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel-measurements-content'
              id='panel-measurements-header'
            >
              <Typography>Measurements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {product.measurements.map((measurement, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant='outlined'>
                      <CardContent>
                        <Typography variant='h6' component='h2'>
                          Stage: {measurement.stage}
                        </Typography>
                        <Typography color='textSecondary'>
                          Temperature (°C):<br></br> Min: {measurement.temp_min.toFixed(2)}<br></br> Avg:{' '}
                          {measurement.temp_avg.toFixed(2)}<br></br> Max: {measurement.temp_max.toFixed(2)}
                        </Typography>
                        <br></br>
                        <Typography color='textSecondary'>
                          Humidity (%):<br></br> Min: {measurement.hum_min.toFixed(2)}<br></br> Avg:{' '}
                          {measurement.hum_avg.toFixed(2)}<br></br>Max: {measurement.hum_max.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-measurements-content"
              id="panel-measurements-header"
            >
              <Typography>Measurements Split by Stage and Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {product.measurements.map((measurement, index) => (
                <div key={index}>
                  <Typography variant="h6" gutterBottom>
                    Stage: {measurement.stage}
                  </Typography>
                  <TableContainer component={Paper} style={{ marginBottom: 16 }}>
                    <Table aria-label={`Temperature Measurements for Stage ${measurement.stage}`}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Min (°C)</TableCell>
                          <TableCell align="right">Avg (°C)</TableCell>
                          <TableCell align="right">Max (°C)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Temperature</TableCell>
                          <TableCell align="right">{measurement.temp_min.toFixed(2)}</TableCell>
                          <TableCell align="right">{measurement.temp_avg.toFixed(2)}</TableCell>
                          <TableCell align="right">{measurement.temp_max.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TableContainer component={Paper}>
                    <Table aria-label={`Humidity Measurements for Stage ${measurement.stage}`}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Min (%)</TableCell>
                          <TableCell align="right">Avg (%)</TableCell>
                          <TableCell align="right">Max (%)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Humidity</TableCell>
                          <TableCell align="right">{measurement.hum_min.toFixed(2)}</TableCell>
                          <TableCell align="right">{measurement.hum_avg.toFixed(2)}</TableCell>
                          <TableCell align="right">{measurement.hum_max.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ))}
            </AccordionDetails>
          </Accordion> */}

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
};

export default PackIngredientCard;
