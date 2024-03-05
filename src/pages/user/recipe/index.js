import React, { useState, useEffect } from 'react';
// import { TextField, Button, Container, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  Box, Container, TextField, Button, Select, Divider, Avatar, CardContent,
  Grid, Typography, Card
} from '@mui/material';
import axios from 'axios';
import Router from 'next/router'

const RecipeForm = (props) => {
  const { accounts } = props
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([]);
    const fetchRecipes = async () => {
      try {
        const recipes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/byOwner/` + accounts);

        for (const recipe of recipes.data) {
          console.log(recipe)
          setProducts(prevProducts => ([
            ...prevProducts,
            {
              id: recipe._id,
              icon: '/static/images/products/salad.png',
              name: recipe.title,
              totalIngredient: recipe.ingredients.length,
            }
          ]));
        }
      } catch (error) {
        console.error('Failed to fetch recipes', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleEditClick = (recipeId) => {
    Router.push(`recipe/edit/${recipeId}`);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Recipes
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={() => Router.push('/user/recipe/edit')}
          >
            Add Recipe*
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {products.map((product) => (
              <Grid
                item
                key={product.id}
                lg={4}
                md={6}
                xs={12}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
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
                      {product.totalIngredient}
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
                            handleEditClick(product.id)
                          }}
                          sx={{ textTransform: 'none' }} // Optional: Prevents uppercase transformation
                        >
                          Edit
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RecipeForm;
