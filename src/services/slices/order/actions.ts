import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (data: string[]) => orderBurgerApi(data)
);
