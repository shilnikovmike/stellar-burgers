import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsData, getUserOrders } from './actions';

type TFeeds = {
  feed: TOrder[];
  userOrders: TOrder[];
  isFeedLoading: boolean;
  isUserOrdersLoading: boolean;
  total: number;
  totalToday: number;
  errMsg?: string;
};

export const initialState: TFeeds = {
  feed: [],
  userOrders: [],
  isFeedLoading: false,
  isUserOrdersLoading: false,
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
    getStoreLoadUserOrders: (state) => state.isUserOrdersLoading
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
      });
  }
});

export const {
  getStoreFeed,
  getStoreUserOrders,
  getStoreLoadFeed,
  getStoreLoadUserOrders
} = feedsSlice.selectors;
export const feedsReducer = feedsSlice.reducer;
