import { createSlice } from '@reduxjs/toolkit';

import { TIngredient } from '@utils-types';
import { getIngredientsData } from './actions';

type TIngredients = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  errMsg?: string;
};

export const initialState: TIngredients = {
  ingredients: [],
  isIngredientsLoading: false
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getStoreIngredients: (state) => state.ingredients,
    getStoreLoadIngredients: (state) => state.isIngredientsLoading
  },
  extraReducers(builder) {
    builder
      .addCase(getIngredientsData.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(getIngredientsData.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredientsData.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.errMsg = action.error?.message;
      });
  }
});

export const { getStoreIngredients, getStoreLoadIngredients } =
  ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;
