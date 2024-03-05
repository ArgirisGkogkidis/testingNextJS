import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Divider
} from '@mui/material';
import axios from 'axios';
import { usePackCreation } from './RecipeContext'; // Adjust the import path as necessary

const RecipeSelection = ({ accounts }) => {
  const { setSelectedRecipe } = usePackCreation();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/byOwner/${accounts}`);
        console.log(data)
        setRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes', error);
      }
    };
    fetchRecipes();
  }, [accounts]);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setSelectedRecipeId(recipe._id);
  };

  const handleDeselect = (e) => {
    // Prevent clicks on recipes from bubbling up
    e.stopPropagation();
    setSelectedRecipe(null);
    setSelectedRecipeId(null);
  };

  return (
    <Box sx={{ pt: 3 }} onClick={handleDeselect}>
      <Grid
        container
        spacing={3}
      >
        {/* Layout Code */}
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} lg={4} md={6} xs={12}>
            <Card onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling to the container
              handleRecipeSelect(recipe);
            }} sx={{
              boxShadow: selectedRecipeId === recipe._id ? "5px 5px 15px rgba(0,0,0,0.3)" : "none",
              cursor: "pointer",
              '&:hover': {
                boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
              },
            }}>
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
                    src='/static/images/products/salad.png'
                    variant="square"
                  />
                </Box>
                <Typography
                  align="center"
                  color="textPrimary"
                  gutterBottom
                  variant="h5"
                >
                  {recipe.title}
                </Typography>
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="body1"
                >
                  Required Ingredients: {recipe.ingredients.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecipeSelection;
