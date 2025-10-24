import {
  addBun,
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  initialState,
  moveIngredient,
  removeIngredient
} from './burgerConstructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

const bun: TIngredient = {
  _id: 'bun-01',
  name: 'Light Bun',
  type: 'bun',
  proteins: 20,
  fat: 5,
  carbohydrates: 40,
  calories: 230,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient: TIngredient = {
  _id: 'main-01',
  name: 'Beef Patty',
  type: 'main',
  proteins: 50,
  fat: 30,
  carbohydrates: 0,
  calories: 430,
  price: 200,
  image: '',
  image_large: '',
  image_mobile: ''
};

const makeConstructorIngredient = (
  id: string,
  source: TIngredient
): TConstructorIngredient => ({
  ...source,
  id
});

describe('burgerConstructorSlice reducer', () => {
  it('Должен вернуть исходное состояние при неизвестном экшене', () => {
    expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('Должен обработать экшен addBun', () => {
    const state = burgerConstructorReducer(initialState, addBun(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('Должен обработать экшен addIngredient', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        id: 'test-uuid',
        _id: ingredient._id
      })
    );
  });

  it('Должен обработать экшен removeIngredient', () => {
    const startState = {
      bun: null,
      ingredients: [
        makeConstructorIngredient('first', ingredient),
        makeConstructorIngredient('second', ingredient)
      ]
    };

    const state = burgerConstructorReducer(
      startState,
      removeIngredient('first')
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('second');
  });

  it('Должен обработать экшен moveIngredient', () => {
    const startState = {
      bun: bun,
      ingredients: [
        makeConstructorIngredient('first', ingredient),
        makeConstructorIngredient('second', ingredient),
        makeConstructorIngredient('third', ingredient)
      ]
    };

    const state = burgerConstructorReducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'second',
      'third',
      'first'
    ]);
  });

  it('Должен игнорировать moveIngredient при выходе индексов за допустимые границы', () => {
    const startState = {
      bun: null,
      ingredients: [
        makeConstructorIngredient('first', ingredient),
        makeConstructorIngredient('second', ingredient)
      ]
    };

    const state = burgerConstructorReducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 5 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'first',
      'second'
    ]);
  });

  it('Должен обработать экшен clearConstructor', () => {
    const startState = {
      bun: bun,
      ingredients: [makeConstructorIngredient('first', ingredient)]
    };

    const state = burgerConstructorReducer(startState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
