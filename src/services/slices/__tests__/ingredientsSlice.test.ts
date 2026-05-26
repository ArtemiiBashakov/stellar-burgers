import { describe, expect, test, jest } from '@jest/globals';
import ingredientsSliceReducer, {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../ingredientsSlice';
import { getIngredientsApi } from '@api';

// Мокаем API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockIngredients = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 40,
    carbohydrates: 150,
    calories: 420,
    price: 1250,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  },
  {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 42,
    calories: 4242,
    price: 4242,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  }
];

describe('ingredientsSlice', () => {
  describe('редьюсеры', () => {
    test('должен вернуть initialState при неизвестном экшене', () => {
      const initialState = {
        ingredients: [],
        loading: false,
        error: null
      };
      const result = ingredientsSliceReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('асинхронный экшен fetchIngredients', () => {
    test('обработка pending: должен установить loading в true', () => {
      const initialState = {
        ingredients: [],
        loading: false,
        error: null
      };

      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsSliceReducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('обработка fulfilled: должен записать данные и установить loading в false', async () => {
      const initialState = {
        ingredients: [],
        loading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = ingredientsSliceReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.ingredients).toEqual(mockIngredients);
      expect(newState.ingredients).toHaveLength(2);
    });

    test('обработка rejected: должен записать ошибку и установить loading в false', () => {
      const initialState = {
        ingredients: [],
        loading: true,
        error: null
      };

      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const newState = ingredientsSliceReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.ingredients).toEqual([]);
    });
  });
});
