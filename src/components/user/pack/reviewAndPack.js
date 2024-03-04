import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import QRCode from 'qrcode.react';
import { usePackCreation } from './RecipeContext';

const ReviewAndConfirm = (props) => {
  const { tracking, accounts } = props;
  const { selectedRecipe, selectedIngredients, productionQuantity, availableIngredients } = usePackCreation();
  const [qrValue, setQrValue] = useState(''); // Placeholder for QR code value
  const [quantities, setQuantities] = useState([]); // Placeholder for QR code value

  // Generate QR code value based on selected options
  const generateQrCode = () => {
    // Example QR value generation
    const qrData = {
      recipeId: selectedRecipe.title,
      quantity: productionQuantity,
      ingredients: selectedIngredients,
    };
    console.log('qrData', JSON.stringify(qrData));
    setQrValue(JSON.stringify(qrData));
  };

  // Placeholder function for final submission
  const handleSubmit = async () => {
    console.log('Submit data to backend or perform final action here');
    const rs = await tracking.methods.createSuperPack(productionQuantity, selectedIngredients, quantities).send({ from: accounts });
    console.log(rs)
    // Here, you might send the data to a backend or generate the PDF
  };

  useEffect(() => {
    setQuantities([])
    if (selectedRecipe && selectedIngredients.length > 0) {
      console.log(selectedRecipe)

      selectedIngredients.forEach(async tknHash => {
        await tracking.methods.getTokenData(tknHash).call().then((tknD) => {
          const dbIngredient = availableIngredients.find(ing => ing.id == Number(tknD[0]));
          console.log('Found One:', dbIngredient)
          selectedRecipe.ingredients.map((ingredient) => {
            console.log(ingredient.code == dbIngredient._id, ingredient.code, dbIngredient._id)
            if (ingredient.code == dbIngredient._id) {
              console.log('Selected?', ingredient, dbIngredient)
              setQuantities(prevQuantities => ([
                ...prevQuantities,
                ingredient.quantity
              ]))
            }
          })
        }).catch((err) => {
        });
      });
    }

  }, [])

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Review and Confirm</Typography>
      <Box sx={{ my: 2 }}>
        {/* Display summary of selections */}
        <Typography>Selected Recipe: {selectedRecipe.title}</Typography>
        <Typography>Ingredients:</Typography>
        <ul>
          {selectedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient} / {quantities[index]}</li>
          ))}
        </ul>
        {/* QR Code generation */}
        <Button onClick={generateQrCode}>Generate QR Code</Button>
        {qrValue && (
          <Box sx={{ my: 2 }}>
            <QRCode value={qrValue} />
            {/* Display QR code here */}
          </Box>
        )}
        <Button variant="contained" onClick={handleSubmit}>Confirm and Submit</Button>
      </Box>
    </Box>
  );
};

export default ReviewAndConfirm;
