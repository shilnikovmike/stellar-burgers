import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getIngredientsData = createAsyncThunk(
  'ingredients/getIngredientsData',
  async () => getIngredientsApi()
);
