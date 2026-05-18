import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface OrderState {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронный thunk для создания заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsId: string[]) => {
    const response = await orderBurgerApi(ingredientsId);
    return response;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        // Создаем объект TOrder из ответа API
        // ingredients — это те id, которые мы отправляли
        const orderData: TOrder = {
          _id: action.payload.order._id,
          status: action.payload.order.status,
          name: action.payload.order.name,
          createdAt: action.payload.order.createdAt,
          updatedAt: action.payload.order.updatedAt,
          number: action.payload.order.number,
          ingredients: action.meta.arg // берем отправленные id ингредиентов из аргументов thunk
        };
        state.orderModalData = orderData;
        state.order = orderData;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  },
  selectors: {
    selectOrder: (state) => state.order,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderError: (state) => state.error
  }
});

export const { closeOrderModal } = orderSlice.actions;
export const {
  selectOrder,
  selectOrderRequest,
  selectOrderModalData,
  selectOrderError
} = orderSlice.selectors;

export default orderSlice.reducer;
