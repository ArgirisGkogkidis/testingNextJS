import React from 'react';
import { PackCreationProvider } from 'src/components/user/pack/RecipeContext';

import PackStepper from 'src/components/user/pack/PackStepper';


const RecipeStepper = (props) => {

  return (
    <PackCreationProvider>
      <PackStepper {...props} />
    </PackCreationProvider>
  );
}
export default RecipeStepper;
