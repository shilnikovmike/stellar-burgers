import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeedsData = createAsyncThunk('feeds/getFeedsData', async () =>
  getFeedsApi()
);

export const getUserOrders = createAsyncThunk('feeds/getUserOrders', async () =>
  getOrdersApi()
);
