import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeedsData = createAsyncThunk('feeds/getFeedsData', getFeedsApi);

export const getUserOrders = createAsyncThunk(
  'feeds/getUserOrders',
  getOrdersApi
);

export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderByNumber',
  getOrderByNumberApi
);
