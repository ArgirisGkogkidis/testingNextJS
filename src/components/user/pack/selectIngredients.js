import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Divider
} from '@mui/material';
import axios from 'axios';
import { usePackCreation } from './RecipeContext'; // Adjust the import path as necessary

const IngredientSelection = (props) => {
  const { tracking, accounts } = props;
  const { setSelectedIngredients, selectedIngredients } = usePackCreation();

  const [ingredients, setIngredients] = useState([{
    id: '',
    ref: '',
    ingredient: '',
    amount: 0,
    name: '',
    icon: null,
    status: '',
  }]);

  useEffect(() => {
    // console.log(value)
    fetchTokens();
  }, [accounts]);

  const fetchTokens = async () => {
    setIngredients([]); // Reset token data before fetching new data

    const results = await tracking.methods.getUserTokens(accounts).call();
    results.forEach((result) => {
      initData(result);
    });
  };

  const milligramsToKilograms = (milligrams) => milligrams / 1e6;

  async function initData(tokenHash) {
    // Skip if the result is the zero address
    if (tokenHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      return; // Skip this iteration and continue with the next loop iteration
    }
    const tknD = await tracking.methods.getTokenData(tokenHash).call()

    if (tknD[3] === accounts && Number(tknD[1]) === 1) {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/` + tknD[0]);

      setIngredients(prevPermisions => ([
        ...prevPermisions,
        {
          id: uuid(),
          ref: tokenHash,
          ingredient: Number(tknD[0]),
          amount: milligramsToKilograms(tknD[2]),
          icon: data.data.data[0]?.icon,
          name: data.data.data[0]?.name,
          createdAt: tknD[6] * 1000,
          status: Number(tknD[1]) === 1 ? 'ready' : (Number(tknD[1]) == 2 ? 'transfered' : 'packed'),
        }
      ]))
    }
  }

  const handleIngredientClick = (ingredientId) => {

    setSelectedIngredients(prev => {
      if (prev.includes(ingredientId)) {
        // If already selected, remove it
        return prev.filter(id => id !== ingredientId);
      } else {
        // Otherwise, add it
        return [...prev, ingredientId];
      }
    });
  };


  return (
    <Box sx={{ pt: 3 }}>
      <Grid
        container
        spacing={3}
      >
        {/* Layout Code */}
        {ingredients.map((ingredient) => (
          <Grid item key={ingredient.ref} lg={4} md={6} xs={12}>
            <Card onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling to the container
              handleIngredientClick(ingredient.ref)
            }} sx={{
              boxShadow: selectedIngredients.includes(ingredient.ref) ? "5px 5px 15px rgba(0,0,0,0.3)" : "none",
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
                    src={ingredient.icon}
                    variant="square"
                  />
                </Box>
                <Typography
                  align="center"
                  color="textPrimary"
                  gutterBottom
                  variant="h5"
                >
                  {ingredient.name}
                </Typography>
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="body1"
                >
                  Quantity (KG): {ingredient.amount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IngredientSelection;
