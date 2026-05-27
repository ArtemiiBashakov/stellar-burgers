import { describe, expect, test, beforeEach } from '@jest/globals';
import constructorSliceReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TIngredient = {
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
};

const mockMainIngredient: TIngredient = {
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
};

const mockSauceIngredient: TIngredient = {
  _id: '3',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 99,
  image: 'image.jpg',
  image_large: 'image-large.jpg',
  image_mobile: 'image-mobile.jpg'
};

describe('constructorSlice', () => {
  describe('редьюсеры', () => {
    test('должен вернуть initialState при неизвестном экшене', () => {
      const initialState = {
        bun: null,
        ingredients: []
      };
      const result = constructorSliceReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });

    test('должен добавить булку (bun)', () => {
      const initialState = {
        bun: null,
        ingredients: []
      };

      const action = addIngredient(mockBun);
      const newState = constructorSliceReducer(initialState, action);

      expect(newState.bun).toBeDefined();
      expect(newState.bun?.name).toBe('Краторная булка N-200i');
      expect(newState.bun?.type).toBe('bun');
      expect(newState.bun?.id).toBeDefined(); // nanoid добавляет id
      expect(newState.ingredients).toHaveLength(0);
    });

    test('должен заменить булку при добавлении другой', () => {
      const firstBun = addIngredient(mockBun);
      let state = constructorSliceReducer(
        { bun: null, ingredients: [] },
        firstBun
      );

      const secondBunIngredient: TIngredient = {
        ...mockBun,
        _id: '4',
        name: 'Флюоресцентная булка R2-D3'
      };

      const secondBun = addIngredient(secondBunIngredient);
      state = constructorSliceReducer(state, secondBun);

      expect(state.bun?.name).toBe('Флюоресцентная булка R2-D3');
      expect(state.bun?._id).toBe('4');
    });

    test('должен добавить начинку/соус (не булку)', () => {
      const initialState = {
        bun: null,
        ingredients: []
      };

      const action = addIngredient(mockMainIngredient);
      const newState = constructorSliceReducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(newState.ingredients[0].id).toBeDefined();
    });

    test('должен удалить ингредиент по id', () => {
      // Сначала добавляем ингредиент
      const addAction = addIngredient(mockMainIngredient);
      let state = constructorSliceReducer(
        { bun: null, ingredients: [] },
        addAction
      );

      const ingredientId = state.ingredients[0].id;

      // Удаляем его
      const removeAction = removeIngredient(ingredientId);
      state = constructorSliceReducer(state, removeAction);

      expect(state.ingredients).toHaveLength(0);
    });

    test('должен переместить ингредиент вверх/вниз', () => {
      // Добавляем два ингредиента
      let state = constructorSliceReducer(
        { bun: null, ingredients: [] },
        addIngredient(mockMainIngredient)
      );
      state = constructorSliceReducer(
        state,
        addIngredient(mockSauceIngredient)
      );

      const firstIngredientId = state.ingredients[0].id;
      const secondIngredientId = state.ingredients[1].id;

      // Перемещаем второй ингредиент на место первого
      const moveAction = moveIngredient({ from: 1, to: 0 });
      state = constructorSliceReducer(state, moveAction);

      expect(state.ingredients[0].id).toBe(secondIngredientId);
      expect(state.ingredients[1].id).toBe(firstIngredientId);
    });

    test('должен очистить конструктор', () => {
      // Добавляем булку и ингредиент
      let state = constructorSliceReducer(
        { bun: null, ingredients: [] },
        addIngredient(mockBun)
      );
      state = constructorSliceReducer(state, addIngredient(mockMainIngredient));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);

      // Очищаем
      state = constructorSliceReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
