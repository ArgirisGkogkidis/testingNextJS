import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Container, Box, Grid } from '@mui/material';
import axios from 'axios';
import { usePackCreation } from './RecipeContext';
import RecipeSelection from './selectRecipe';
import IngredientSelection from './selectIngredients';
import ProductionSetup from './productionSetupStep';
import ReviewAndConfirm from './reviewAndPack';
import { useRouter } from 'next/router';

function getSteps() {
  return ['Select Recipe', 'Production Settings', 'Select Ingredients', 'Review and Confirm'];
}

const PackStepper = (props) => {
  const { tracking, accounts } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [isNextDisabled, setNextDisabled] = useState(false);
  const {
    selectedRecipe,
    selectedIngredients,
    productionQuantity,
    availableIngredients,
    setAvailableIngredients,
    quantities,
  } = usePackCreation();
  const steps = getSteps();
  const router = useRouter();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/all`,
        );
        setAvailableIngredients(response.data.data);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }
    };
    fetchIngredients();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    console.log('Submit data to backend or perform final action here');
    // const rs = await tracking.methods.createSuperPack(productionQuantity, selectedIngredients, quantities).send({ from: accounts });
    try {
      const rs = await tracking.methods
        .createSuperPack(productionQuantity, selectedIngredients, quantities)
        .send({ from: accounts });
      console.log('response', rs.events.PackCreated.returnValues[1]);
      // Here, you might send the data to a backend or generate the PDF

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/${selectedRecipe._id}/packs`,
        {
          packIds: [rs.events.PackCreated.returnValues[1]],
        },
      );

      console.log('Recipe updated successfully', response.data);
      // return response.data;

      // On successful submit, redirect to another url
      router.push('/user/viewpack'); // Replace '/your-success-url' with your target URL
    } catch (error) {
      console.error('An error occurred during the submit:', error);
      // Handle submit error here (optional)
    }
  };

  const milligramsToKilograms = (milligrams) => milligrams / 1e6;

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <RecipeSelection accounts={props.accounts} />;
      case 1:
        return <ProductionSetup {...props} />;
      case 2:
        return <IngredientSelection {...props} />;
      case 3:
        return <ReviewAndConfirm {...props} />;
      default:
        return 'Unknown step';
    }
  }

  useEffect(() => {
    const isNextDisabled =
      (activeStep === 0 && !selectedRecipe) ||
      (activeStep === 2 && selectedIngredients.length <= 0);
    setNextDisabled(isNextDisabled);
  }, [activeStep, selectedRecipe, selectedIngredients]);

  return (
    <Container>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container spacing={2}>
          {activeStep != 3 && (
            <Grid item xs={12} md={3}>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {/* Display selected recipe information */}
                  {selectedRecipe && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant='h6'>Selected Recipe:</Typography>
                      <Typography variant='subtitle1'>{selectedRecipe.title}</Typography>
                      <Typography variant='body2'>
                        Ingredients needed: {selectedRecipe.ingredients.length}
                      </Typography>
                      {selectedRecipe.ingredients.map((ingredient) => (
                        <div key={ingredient.code}>
                          <Typography variant='body2'>
                            {availableIngredients.find((ing) => ing._id === ingredient.code)
                              ?.name || 'Ingredient not found'}{' '}
                          </Typography>
                          <Typography variant='body2'>
                            {milligramsToKilograms(
                              Number(ingredient.quantity) * productionQuantity,
                            )}{' '}
                            / KG{' '}
                          </Typography>
                        </div>
                      ))}
                      <Typography variant='body2'>Total Packs: {productionQuantity}</Typography>
                    </Box>
                  )}

                  {selectedIngredients && selectedIngredients.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant='h6'>Selected Ingredients:</Typography>
                      <Typography variant='body2'>Count: {selectedIngredients.length}</Typography>
                    </Box>
                  )}
                </Grid>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={activeStep != 4 ? 9 : 12}>
            {activeStep === steps.length ? (
              <div>
                <Typography>All steps completed</Typography>
              </div>
            ) : (
              <>
                {getStepContent(activeStep)}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={isNextDisabled}
                  >
                    {activeStep === steps.length - 1 ? 'Confirm and Submit' : 'Next'}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
export default PackStepper;
