import React, { useState, useEffect } from 'react';
// import { TextField, Button, Container, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  Box, Container, TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Grid, Typography, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import { useRouter } from 'next/router'

const RecipeForm = (props) => {
  const router = useRouter()
  const { id } = router.query
  const { accounts } = props
  const [recipe, setRecipe] = useState({
    title: '',
    totalUnits: '',
    ingredients: [{ code: '', quantity: '', unit: 'Grams', shelfLife: '' }],
    owner: accounts
  });

  const handleRecipeChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, e) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [e.target.name]: e.target.value };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };


  const [availableIngredients, setAvailableIngredients] = useState([]);

  useEffect(() => {

    // Fetch recipe data if an ID is provided
    const fetchRecipe = async () => {
      if (!id) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/all`);
        setAvailableIngredients(response.data.data);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/${id}`);
        const data = response.data.data.doc;
        console.log('Recipe Data', data);
        // Convert ingredient quantities from grams if necessary and update form state
        const updatedIngredients = await Promise.all(data.ingredients.map(async ingredient => {
          console.log('Ing', ingredient.code);
          return {
            ...ingredient,
            quantity: ingredient.unit === 'Grams' ? ingredient.quantity : ingredient.quantity / 1000,
            unit: ingredient.unit === 'Grams' ? 'Grams' : 'KG',
          };
        }));
        setRecipe({ ...data, ingredients: updatedIngredients });
        console.log('Final recipe', recipe);
      } catch (error) {
        console.error('Failed to fetch recipe data', error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const convertKilogramsToGrams = (kilograms) => {
    return Math.round(kilograms * 1000);
  };
  const gramsToKilograms = (grams) => grams / 1000;

  const convertKgToMilligrams = (kg) => Math.round(kg * 1e6);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert all ingredient quantities to grams if needed
    const ingredientsInGrams = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.unit === 'KG' ? convertKgToMilligrams(ingredient.quantity) : convertKgToMilligrams(gramsToKilograms(ingredient.quantity)), unit: 'Milligrams', // Standardize unit
    }));

    // Prepare the recipe with standardized ingredient quantities
    const recipeToSave = {
      ...recipe,
      ingredients: ingredientsInGrams,
    };

    console.log(recipeToSave);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes`, recipeToSave);
      // Handle success - e.g., clear the form, show a message
    } catch (error) {
      alert(error)
    }
  };
  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { code: '', quantity: '', unit: '', shelfLife: '' }],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
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
        <Typography variant="h4" gutterBottom>
          Create Recipe
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Recipe Title"
                value={recipe.title}
                onChange={handleRecipeChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="totalUnits"
                label="Total Units"
                value={recipe.totalUnits}
                onChange={handleRecipeChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            {recipe.ingredients.map((ingredient, index) => (
              <React.Fragment key={index}>
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Ingredient</InputLabel>
                    <Select
                      name="code"
                      value={ingredient.code}
                      onChange={(e) => handleIngredientChange(index, e)}
                    >
                      {availableIngredients.map((ing) => (
                        <MenuItem key={ing._id} value={ing._id}>{ing.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="quantity"
                    label="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Unit</InputLabel>
                    <Select
                      name="unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, e)}
                    >
                      <MenuItem value="KG">KG</MenuItem>
                      <MenuItem value="Grams">Grams</MenuItem>
                      <MenuItem value="Milligrams">Milligrams</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    name="shelfLife"
                    label="Shelf Life"
                    value={ingredient.shelfLife}
                    onChange={(e) => handleIngredientChange(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <IconButton onClick={() => removeIngredient(index)} color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
              <Button startIcon={<AddCircleOutlineIcon />} onClick={addIngredient} variant="outlined">
                Add Ingredient
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save Recipe
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RecipeForm;
