import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TConstructorState,
  TIngredient
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

// Define the initial state structure
const initialState: TConstructorState = {
  items: {
    bun: null,
    ingredients: []
  }
};

// Helper function to create constructor ingredients with unique IDs
const createConstructorIngredient = (
  ingredient: TIngredient
): TConstructorIngredient => ({
  ...ingredient,
  id: uuidv4()
});

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  selectors: {
    selectSelection: (state: TConstructorState) => state.items,
    selectBun: (state: TConstructorState) => state.items.bun,
    selectIngredients: (state: TConstructorState) => state.items.ingredients
  },
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        console.log(state.items.bun);
        state.items.bun = { ...action.payload, id: 'bun' };
      } else {
        console.log(state.items.bun);
        state.items.ingredients.push({
          ...action.payload,
          id: uuidv4()
        });
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },
    moveUpIngredient: (state, action: PayloadAction<string>) => {
      const { ingredients } = state.items;
      const index = ingredients.findIndex((ing) => ing.id === action.payload);

      if (index > 0) {
        [ingredients[index], ingredients[index - 1]] = [
          ingredients[index - 1],
          ingredients[index]
        ];
      }
    },
    moveDownIngredient: (state, action: PayloadAction<string>) => {
      const { ingredients } = state.items;
      const index = ingredients.findIndex((ing) => ing.id === action.payload);

      if (index >= 0 && index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    },
    clearConstructor: (state) => {
      state.items = initialState.items;
    }
  }
});

// Export actions
export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveUpIngredient,
  moveDownIngredient
} = constructorSlice.actions;

// Export selectors with proper typing
export const { selectSelection } = constructorSlice.selectors;

export default constructorSlice.reducer;
