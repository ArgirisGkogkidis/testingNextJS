import React, { createContext, useContext, useState } from 'react';

const PackCreationContext = createContext();

export const usePackCreation = () => useContext(PackCreationContext);

export const PackCreationProvider = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [productionQuantity, setProductionQuantity] = useState(1); // Default to 1 or a sensible default for your application

  const [availableIngredients, setAvailableIngredients] = useState([]);

  // More state as necessary
  const updateProductionQuantity = (quantity) => {
    setProductionQuantity(quantity);
    // Potentially update selectedIngredients here based on the new quantity
    // For example, you might need to scale the quantities of selectedIngredients based on the productionQuantity
  };

  const value = {
    selectedRecipe,
    setSelectedRecipe,
    selectedIngredients,
    setSelectedIngredients,
    productionQuantity,
    updateProductionQuantity,
    availableIngredients,
    setAvailableIngredients
    // More setters as necessary
  };

  return (
    <PackCreationContext.Provider value={value}>
      {children}
    </PackCreationContext.Provider>
  );
};
