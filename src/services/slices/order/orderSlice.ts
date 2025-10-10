import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { sendOrder } from './actions';

type TSendOrder = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  errMsg?: string;
};

export const initialState: TSendOrder = {
  orderRequest: false,
  orderModalData: null,
  errMsg: ''
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderRequest: (state) => {
      state.orderRequest = false;
    },
    resetModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.errMsg = action.error?.message;
      });
  },
  selectors: {
    getStoreOrderRequest: (state) => state.orderRequest,
    getStoreModalData: (state) => state.orderModalData
  }
});

export const { getStoreModalData, getStoreOrderRequest } = orderSlice.selectors;
export const { setOrderRequest, resetModalData } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
