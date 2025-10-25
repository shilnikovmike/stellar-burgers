import { ingredientsReducer, initialState } from './ingredientsSlice';
import { getIngredientsData } from './actions';
import { TIngredient } from '@utils-types';

const ingredientsMock: TIngredient[] = [
  {
    _id: 'ingredient-1',
    name: 'Sauce 1',
    type: 'sauce',
    proteins: 2,
    fat: 1,
    carbohydrates: 5,
    calories: 30,
    price: 10,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: 'ingredient-2',
    name: 'Main 1',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 110,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredientsSlice reducer', () => {
  it('Должен обработать getIngredientsData.pending', () => {
    const state = ingredientsReducer(
      initialState,
      getIngredientsData.pending('', undefined)
    );

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.errMsg).toBeUndefined();
  });

  it('Должен обработать getIngredientsData.fulfilled', () => {
    const loadingState = {
      ...initialState,
      isIngredientsLoading: true
    };

    const state = ingredientsReducer(
      loadingState,
      getIngredientsData.fulfilled(ingredientsMock, '', undefined)
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredientsMock);
  });

  it('Должен обработать getIngredientsData.rejected', () => {
    const loadingState = {
      ...initialState,
      isIngredientsLoading: true
    };

    const error = new Error('Запрос завершился ошибкой');

    const state = ingredientsReducer(
      loadingState,
      getIngredientsData.rejected(error, '', undefined)
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.errMsg).toBe('Запрос завершился ошибкой');
  });
});
