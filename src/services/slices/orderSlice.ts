import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { RootState } from '../store';

interface OrderState {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null; // дляпросматриваемого заказа
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null
};

// Существующий для создания заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsId: string[]) => {
    const response = await orderBurgerApi(ingredientsId);
    return response;
  }
);

// для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    },
    clearCurrentOrder: (state) => {
      // для очистки
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        const orderData: TOrder = {
          _id: action.payload.order._id,
          status: action.payload.order.status,
          name: action.payload.order.name,
          createdAt: action.payload.order.createdAt,
          updatedAt: action.payload.order.updatedAt,
          number: action.payload.order.number,
          ingredients: action.meta.arg
        };
        state.orderModalData = orderData;
        state.order = orderData;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      // для получения заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка получения заказа';
      });
  }
});

export const { closeOrderModal, clearCurrentOrder } = orderSlice.actions;

// Существующие селекторы
export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderError = (state: RootState) => state.order.error;

// Новый селектор
export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;

export default orderSlice.reducer;
