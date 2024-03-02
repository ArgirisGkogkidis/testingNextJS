import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Backdrop, Fade, IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, // Adjust width as needed
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const IngredientModal = ({ open, onClose, onSaveIngredient, ingredient, updateIngredient }) => {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateIngredient('icon', reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      updateIngredient(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(ingredient);
    onSaveIngredient(ingredient);
  };

  useEffect(() => {
    console.log(ingredient)
    if (!open) {
      updateIngredient('id', '');
      updateIngredient('name', '');
      updateIngredient('icon', null);
    }
  }, [open, updateIngredient]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      aria-labelledby="ingredient-modal-title"
      aria-describedby="ingredient-modal-description"
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="ingredient-modal-title" variant="h6" component="h2">
            Add Ingredient
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2, width: '100%' }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="ingredient-id"
              label="ID"
              name="id"
              value={ingredient.id}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              id="ingredient-name"
              label="Name"
              name="name"
              value={ingredient.name}
              onChange={handleChange}
              margin="normal"
            />
            <label htmlFor="icon-button-file">
              <Input accept="image/*" id="icon-button-file" type="file" name="icon" onChange={handleChange} />
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
              {ingredient.icon ? ingredient.icon.name : 'Upload Icon'}
            </label>
            {typeof ingredient.icon === 'string' && ingredient.icon.startsWith('data:image') && (
              <img src={ingredient.icon} alt="Ingredient" style={{ width: '100px', height: '100px' }} />
            )}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
            >
              Save Ingredient
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default IngredientModal;
