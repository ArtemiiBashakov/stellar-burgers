import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '@api';
import { RootState } from '../store';

interface FeedState {
  orders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  userOrdersLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  userOrdersLoading: false,
  error: null
};

//Существующий thunk для ленты заказов
export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'feed/fetchFeeds',
  async () => {
    const data = await getFeedsApi();
    return data;
  }
);

//Новый thunk для истории заказов пользователя
export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'feed/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Лента заказов
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      //История заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersLoading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      });
  }
});

// Существующие селекторы
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedLoading = (state: RootState) => state.feed.loading;
export const selectFeedError = (state: RootState) => state.feed.error;

// 👇 Новые селекторы
export const selectUserOrders = (state: RootState) => state.feed.userOrders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.feed.userOrdersLoading;

export default feedSlice.reducer;
