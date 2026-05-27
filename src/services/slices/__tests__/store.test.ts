import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../store';
import ingredientsReducer from '../ingredientsSlice';
import constructorReducer from '../constructorSlice';
import orderReducer from '../orderSlice';
import userReducer from '../userSlice';
import feedReducer from '../feedSlice';

describe('rootReducer', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    // Ожидаемое начальное состояние
    const expectedState = {
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        orderRequest: false,
        orderModalData: null,
        currentOrder: null, // если добавили ранее
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        userOrders: [], // если добавили ранее
        total: 0,
        totalToday: 0,
        loading: false,
        userOrdersLoading: false,
        error: null
      }
    };

    // Вызываем rootReducer с undefined и неизвестным экшеном
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    // Проверяем, что состояние соответствует ожидаемому
    expect(state).toEqual(expectedState);
  });

  test('должен корректно инициализироваться через configureStore', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    // Проверяем, что каждый слайс присутствует
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');

    // Проверяем структуру каждого слайса
    expect(state.ingredients).toHaveProperty('ingredients');
    expect(state.ingredients).toHaveProperty('loading');
    expect(state.ingredients).toHaveProperty('error');

    expect(state.burgerConstructor).toHaveProperty('bun');
    expect(state.burgerConstructor).toHaveProperty('ingredients');

    expect(state.order).toHaveProperty('order');
    expect(state.order).toHaveProperty('orderRequest');
    expect(state.order).toHaveProperty('orderModalData');
    expect(state.order).toHaveProperty('error');

    expect(state.user).toHaveProperty('user');
    expect(state.user).toHaveProperty('isAuthChecked');
    expect(state.user).toHaveProperty('isLoading');
    expect(state.user).toHaveProperty('error');

    expect(state.feed).toHaveProperty('orders');
    expect(state.feed).toHaveProperty('total');
    expect(state.feed).toHaveProperty('totalToday');
    expect(state.feed).toHaveProperty('loading');
    expect(state.feed).toHaveProperty('error');
  });
});
