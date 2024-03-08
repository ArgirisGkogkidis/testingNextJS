// import React, { useState, useEffect } from 'react';
// import { Button, Typography, Box, Grid } from '@mui/material';
// import QRCode from 'qrcode.react';
// import { usePackCreation } from './RecipeContext';
// import { useRouter } from 'next/router';

// const ReviewAndConfirm = (props) => {
//   const { tracking, accounts } = props;
//   const { selectedRecipe, selectedIngredients, productionQuantity, availableIngredients } = usePackCreation();
//   const [qrValue, setQrValue] = useState(''); // Placeholder for QR code value
//   const [quantities, setQuantities] = useState([]); // Placeholder for QR code value
//   const router = useRouter();

//   // Generate QR code value based on selected options
//   const generateQrCode = () => {
//     // Example QR value generation
//     const qrData = {
//       recipeId: selectedRecipe.title,
//       quantity: productionQuantity,
//       ingredients: selectedIngredients,
//     };

//     setQrValue(JSON.stringify(qrData));
//   };

//   // Placeholder function for final submission
//   const handleSubmit = async () => {
//     console.log('Submit data to backend or perform final action here');
//     // const rs = await tracking.methods.createSuperPack(productionQuantity, selectedIngredients, quantities).send({ from: accounts });
//     try {
//       const rs = await tracking.methods.createSuperPack(productionQuantity, selectedIngredients, quantities).send({ from: accounts });
//       console.log(rs);
//       // Here, you might send the data to a backend or generate the PDF

//       // On successful submit, redirect to another url
//       router.push('/user/viewpack'); // Replace '/your-success-url' with your target URL
//     } catch (error) {
//       console.error('An error occurred during the submit:', error);
//       // Handle submit error here (optional)
//     }
//     // console.log(rs)
//     // Here, you might send the data to a backend or generate the PDF
//   };

//   useEffect(() => {
//     setQuantities([])
//     if (selectedRecipe && selectedIngredients.length > 0) {
//       console.log(selectedRecipe)

//       selectedIngredients.forEach(async tknHash => {
//         await tracking.methods.getTokenData(tknHash).call().then((tknD) => {
//           const dbIngredient = availableIngredients.find(ing => ing.id == Number(tknD[0]));
//           console.log('Found One:', dbIngredient)
//           selectedRecipe.ingredients.map((ingredient) => {
//             console.log(ingredient.code == dbIngredient._id, ingredient.code, dbIngredient._id)
//             if (ingredient.code == dbIngredient._id) {
//               console.log('Selected?', ingredient, dbIngredient)
//               setQuantities(prevQuantities => ([
//                 ...prevQuantities,
//                 ingredient.quantity
//               ]))
//             }
//           })
//         }).catch((err) => {
//         });
//       });
//     }

//   }, [])

//   return (
//     <Box sx={{ mt: 2 }}>
//       <Typography variant="h6">Review and Confirm</Typography>
//       <Box sx={{ my: 2 }}>
//         {/* Display summary of selections */}
//         <Typography>Selected Recipe: {selectedRecipe.title}</Typography>
//         <Typography>Ingredients:</Typography>
//         <ul>
//           {selectedIngredients.map((ingredient, index) => (
//             <li key={index}>{ingredient} / {quantities[index]}</li>
//           ))}
//         </ul>
//         {/* QR Code generation */}
//         <Button onClick={generateQrCode}>Generate QR Code</Button>
//         {qrValue && (
//           <Box sx={{ my: 2 }}>
//             <QRCode value={qrValue} />
//             {/* Display QR code here */}
//           </Box>
//         )}
//         <Button variant="contained" onClick={handleSubmit}>Confirm and Submit</Button>
//       </Box>
//     </Box>
//   );
// };

// export default ReviewAndConfirm;

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import { usePackCreation } from './RecipeContext';
import { useRouter } from 'next/router';

const ReviewAndConfirm = (props) => {
  const { tracking, accounts } = props;
  const { selectedRecipe, selectedIngredients, productionQuantity, availableIngredients, setQuantities } =
    usePackCreation();
  const [ingredientSummary, setIngredientSummary] = useState([]);
  const router = useRouter();

  // Function to convert quantities to a readable format
  const formatQuantity = (quantity) => {
    // Assuming quantity is given in grams and you convert to KG if it's more than 1000 grams
    return quantity >= 1000
      ? `${(quantity / 1000000).toFixed(2)} KG`
      : `${quantity.toFixed(2)} Grams`;
  };
  // Helper function to perform the asynchronous operation and return a value
  const getIngredientData = async (ingredient) => {
    try {
      const tknD = await tracking.methods.getTokenData(ingredient).call();
      const dbIngredient = availableIngredients.find((ing) => ing.id === Number(tknD[0]));

      if (!dbIngredient) {
        console.error('Ingredient not found in the database', ingredient);
        return null; // Handle the case where the ingredient is not found
      }

      // Assuming selectedRecipe.ingredients is an array with a matching 'code' field
      const recipeIngredient = selectedRecipe.ingredients.find(
        (ri) => ri.code === dbIngredient._id,
      );

      if (recipeIngredient) {
        const quantity = recipeIngredient.quantity;
        const formattedQuantity = formatQuantity(quantity);
        setQuantities((prevQuantities) => [...prevQuantities, quantity]);
        return {
          name: dbIngredient.name,
          weight: formattedQuantity,
          quantity: productionQuantity,
        };
      }
    } catch (err) {
      console.error('Error fetching token data:', err);
    }
    return null; // Return null or some default value in case of error
  };

  // Function to update the ingredient summary
  const updateIngredientSummary = async () => {
    // Use Promise.all to wait for all the getTokenData calls to resolve
    const summary = await Promise.all(selectedIngredients.map(getIngredientData));

    // Filter out any null values that might have occurred due to errors or not found ingredients
    setIngredientSummary(summary.filter(Boolean));
  };

  // Call this function when you need to refresh the ingredient summary, for example in useEffect
  useEffect(() => {
    setQuantities([]);
    if (selectedIngredients.length > 0) {
      updateIngredientSummary();
    }
  }, [selectedIngredients, availableIngredients, selectedRecipe]);

  // Placeholder function for final submission
  const handleSubmit = async () => {
    console.log('Submit data to backend or perform final action here');
    // const rs = await tracking.methods.createSuperPack(productionQuantity, selectedIngredients, quantities).send({ from: accounts });
    try {
      const rs = await tracking.methods
        .createSuperPack(productionQuantity, selectedIngredients, quantities)
        .send({ from: accounts });
      console.log(rs);
      // Here, you might send the data to a backend or generate the PDF

      // On successful submit, redirect to another url
      router.push('/user/viewpack'); // Replace '/your-success-url' with your target URL
    } catch (error) {
      console.error('An error occurred during the submit:', error);
      // Handle submit error here (optional)
    }
  };

  return (
    <Box sx={{ mt: 2, p: 3 }}>
      <Typography variant='h6' gutterBottom>
        Review and Confirm
      </Typography>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant='subtitle1'>Selected Recipe: {selectedRecipe.title}</Typography>
        <Typography variant='subtitle1' sx={{ mt: 2 }}>
          Ingredients:
        </Typography>
        <List>
          {ingredientSummary.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={ingredient.name}
                secondary={`Quantity: ${ingredient.weight} x ${ingredient.quantity} `}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Confirm and Submit
        </Button>
      </Box> */}
    </Box>
  );
};

export default ReviewAndConfirm;
