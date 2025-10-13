import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsData, getUserOrders, getOrderByNumber } from './actions';

type TFeeds = {
  feed: TOrder[];
  userOrders: TOrder[];
  isFeedLoading: boolean;
  isUserOrdersLoading: boolean;
  currentOrder: TOrder | null;
  isOrderLoading: boolean;
  total: number;
  totalToday: number;
  errMsg?: string;
};

export const initialState: TFeeds = {
  feed: [],
  userOrders: [],
  isFeedLoading: false,
  isUserOrdersLoading: false,
  currentOrder: null,
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  errMsg: ''
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getStoreFeed: (state) => state.feed,
    getStoreLoadFeed: (state) => state.isFeedLoading,
    getStoreUserOrders: (state) => state.userOrders,
    getStoreLoadUserOrders: (state) => state.isUserOrdersLoading,
    getStoreCurrentOrder: (state) => state.currentOrder,
    getStoreLoadCurrentOrder: (state) => state.isOrderLoading
  },
  extraReducers(builder) {
    builder
      .addCase(getFeedsData.pending, (state) => {
        state.errMsg = '';
        state.isFeedLoading = true;
      })
      .addCase(getFeedsData.fulfilled, (state, aciton) => {
        state.isFeedLoading = false;
        state.feed = aciton.payload.orders;
        state.total = aciton.payload.total;
        state.totalToday = aciton.payload.totalToday;
      })
      .addCase(getFeedsData.rejected, (state, aciton) => {
        state.isFeedLoading = false;
        state.errMsg = aciton.error?.message;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.errMsg = '';
        state.isUserOrdersLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, aciton) => {
        state.isUserOrdersLoading = false;
        state.userOrders = aciton.payload;
      })
      .addCase(getUserOrders.rejected, (state, aciton) => {
        state.isUserOrdersLoading = false;
        state.errMsg = aciton.error?.message;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.errMsg = '';
        state.isOrderLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.currentOrder = action.payload.orders[0] ?? null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.errMsg = action.error?.message;
      });
  }
});

export const {
  getStoreFeed,
  getStoreUserOrders,
  getStoreLoadFeed,
  getStoreLoadUserOrders,
  getStoreCurrentOrder,
  getStoreLoadCurrentOrder
} = feedsSlice.selectors;
export const feedsReducer = feedsSlice.reducer;
