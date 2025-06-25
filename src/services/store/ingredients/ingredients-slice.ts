// ingredientsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TIngredientsState } from '@utils-types';
import { getIngredientsApi } from '@api';

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  selectedIngredient: null
};

export const loadIngredients = createAsyncThunk(
  'ingredients/loadIngredients',
  async () => await getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    selectAllIngredients: (state) => state.ingredients,
    selectIngredientsLoading: (state) => state.loading,
    selectSelectedIngredient: (state) =>
      state.ingredients.find((it) => it._id === state.selectedIngredient) ??
      null
  },
  reducers: {
    selectIngredient: (state, action: PayloadAction<string | null>) => {
      state.selectedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { selectIngredient } = ingredientsSlice.actions;
export const {
  selectAllIngredients,
  selectIngredientsLoading,
  selectSelectedIngredient
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
