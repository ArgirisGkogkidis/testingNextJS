import React, { useState, useEffect } from 'react';
// import { TextField, Button, Container, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  Box, Container, TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Grid, Typography, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import { useRouter } from 'next/router';

const RecipeForm = (props) => {
  const router = useRouter();
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
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/all`);
        setAvailableIngredients(response.data.data);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const convertToMilligrams = (quantity, unit) => {
    if (unit === 'KG') {
      return Math.round(quantity * 1e6); // Convert kilograms to milligrams
    } else { // Assuming the only other unit is grams
      return Math.round(quantity * 1e3); // Convert grams to milligrams
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert all ingredient quantities to grams if needed
    const ingredientsInGrams = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: convertToMilligrams(ingredient.quantity, ingredient.unit),//ingredient.unit === 'KG' ? convertKgToMilligrams(ingredient.quantity) : convertKgToMilligrams(gramsToKilograms(ingredient.quantity)),
      unit: 'Milligrams', // Standardize unit
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
      router.push('/user/recipe');
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
              <FormControl fullWidth variant="outlined">
                <InputLabel id="totalUnits-label">Recipe Type</InputLabel>
                <Select
                  labelId="totalUnits-label"
                  id="totalUnits"
                  name="totalUnits"
                  value={recipe.totalUnits}
                  onChange={handleRecipeChange}
                  label="Total Units"
                >
                  <MenuItem value="1">Cold</MenuItem>
                  <MenuItem value="2">Cooked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {recipe.ingredients.map((ingredient, index) => (
              <React.Fragment key={index}>
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Ingredient</InputLabel>
                    <Select
                      name="code"
                      value={ingredient._id}
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
                  {/* <TextField
                    name="shelfLife"
                    label="Shelf Life"
                    value={ingredient.shelfLife}
                    onChange={(e) => handleIngredientChange(index, e)}
                    fullWidth
                    variant="outlined"
                  /> */}
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
