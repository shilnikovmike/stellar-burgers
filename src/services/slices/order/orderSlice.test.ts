import {
  orderReducer,
  initialState,
  setOrderRequest,
  resetModalData
} from './orderSlice';
import { sendOrder } from './actions';
import { TOrder } from '@utils-types';

const orderMock: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'Test order',
  createdAt: '',
  updatedAt: '',
  number: 101,
  ingredients: ['ingredient-1', 'ingredient-2']
};

describe('orderSlice reducer', () => {
  it('Должен вернуть исходное состояние при неизвестном экшене', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Должен обработать sendOrder.pending', () => {
    const state = orderReducer(
      initialState,
      sendOrder.pending('', ['ingredient-1'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
  });

  it('Должен обработать sendOrder.fulfilled', () => {
    const loadingState = {
      ...initialState,
      orderRequest: true
    };

    const state = orderReducer(
      loadingState,
      sendOrder.fulfilled(
        { success: true, order: orderMock, name: orderMock.name },
        '',
        ['ingredient-1']
      )
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(orderMock);
  });

  it('Должен обработать sendOrder.rejected', () => {
    const loadingState = {
      ...initialState,
      orderRequest: true
    };

    const error = new Error('Заказ не удался');

    const state = orderReducer(
      loadingState,
      sendOrder.rejected(error, '', ['ingredient-1'])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.errMsg).toBe('Заказ не удался');
  });

  it('Должен обработать редьюсер setOrderRequest', () => {
    const state = orderReducer(
      { ...initialState, orderRequest: true },
      setOrderRequest()
    );

    expect(state.orderRequest).toBe(false);
  });

  it('Должен обработать редьюсер resetModalData', () => {
    const state = orderReducer(
      { ...initialState, orderModalData: orderMock },
      resetModalData()
    );

    expect(state.orderModalData).toBeNull();
  });
});
