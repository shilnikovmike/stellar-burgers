import store from './store';
import { initialState as ingredientsInitialState } from './slices/ingredients/ingredientsSlice';
import { initialState as feedsInitialState } from './slices/feeds/feedsSlice';
import { initialState as orderInitialState } from './slices/order/orderSlice';
import { initialState as userInitialState } from './slices/user/userSlice';
import { initialState as constructorInitialState } from './slices/burgerConstructor/burgerConstructorSlice';

describe('root store configuration', () => {
  it('Должен инициализироваться значениями initialState всех слайсов', () => {
    expect(store.getState()).toEqual({
      user: userInitialState,
      order: orderInitialState,
      feeds: feedsInitialState,
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState
    });
  });
});
