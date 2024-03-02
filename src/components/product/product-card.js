import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography, Button } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';
import { Download as DownloadIcon } from '../../icons/download';

export const ProductCard = ({ product, onEditIngredient }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
  // {...rest}
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
          alt="Product"
          src={product.icon}
          variant="square"
        />
      </Box>
      <Typography
        align="center"
        color="textPrimary"
        gutterBottom
        variant="h5"
      >
        {product.name}
      </Typography>
      <Typography
        align="center"
        color="textPrimary"
        variant="body1"
      >
        {product.description}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider />
    <Box sx={{ p: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'center', }}
      >
        <Grid
          item
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Button
            variant="outlined" // You can choose "text", "contained", or "outlined"
            color="primary" // This is the color of the button
            onClick={() => {
              // Your edit action here
              // For example, calling a function to open a modal:
              onEditIngredient(product)
            }}
            sx={{ textTransform: 'none' }} // Optional: Prevents uppercase transformation
          >
            Edit
          </Button>
        </Grid>
        {/* <Grid
          item
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <DownloadIcon color="action" />
          <Typography
            color="textSecondary"
            display="inline"
            sx={{ pl: 1 }}
            variant="body2"
          >
            {product.totalDownloads}
            {' '}
            Downloads
          </Typography>
        </Grid> */}
      </Grid>
    </Box>
  </Card>
);

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};
