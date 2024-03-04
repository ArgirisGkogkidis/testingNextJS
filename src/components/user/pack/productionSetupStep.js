import React from 'react';
import { TextField, Grid, Box, Typography, Container } from '@mui/material';
import { usePackCreation } from './RecipeContext';

const ProductionSetup = () => {
  const { productionQuantity, updateProductionQuantity } = usePackCreation();

  const handleQuantityChange = (event) => {
    const newQuantity = event.target.value;
    updateProductionQuantity(newQuantity);
  };

  return (
    <Container>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Set production Quantity
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="Production Quantity"
                type="number"
                value={productionQuantity}
                onChange={handleQuantityChange}
                fullWidth
                inputProps={{ min: "1" }}
              />
            </Grid>
          </Grid>
        </Box>


        {/* Display updated ingredient quantities based on productionQuantity here */}
      </Box>
    </Container>
  );
};

export default ProductionSetup;
