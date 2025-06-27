import { TFeed, TOrdersState } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

const initialOrdersState: TOrdersState = {
  // Состояние создания заказа
  orderError: null, // Ошибка при создании
  orderRequest: false, // Флаг загрузки
  newOrder: null, // Созданный заказ

  // История заказов пользователя
  history: [], // Список заказов
  historyRequest: false, // Флаг загрузки истории

  // Лента заказов
  feed: null, // Данные ленты
  feedRequest: false, // Флаг загрузки ленты
  feedError: null, // Ошибка загрузки ленты

  // Детали конкретного заказа
  selectedOrder: null, // Данные выбранного заказа
  selectedOrderError: null, // Ошибка загрузки
  selectedOrderId: null, // ID выбранного заказа
  selectedOrderRequest: false // Флаг загрузки
};

// Создание нового заказа
export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[], { rejectWithValue }) => {
    const response = await orderBurgerApi(ingredients);
    return response.success ? response.order : rejectWithValue(response);
  }
);

// Получение истории заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => await getOrdersApi()
);

// Получение списка заказов (всех заказов в системе)
export const fetchFeedData = createAsyncThunk(
  'orders/fetchFeed',
  async (_, { rejectWithValue }) => {
    const result = await getFeedsApi();
    return result.success
      ? ({
          orders: result.orders,
          total: result.total,
          totalToday: result.totalToday
        } as TFeed)
      : rejectWithValue(result);
  }
);

// Получение деталей конкретного заказа по номеру
export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (orderId: number, { rejectWithValue, dispatch }) => {
    dispatch(orderActions.setOrderId(orderId));
    const apiResponse = await getOrderByNumberApi(orderId);
    return apiResponse.success
      ? apiResponse.orders[0]
      : rejectWithValue(apiResponse);
  }
);

export const orderSlice = createSlice({
  name: 'orderSystem',
  initialState: initialOrdersState,
  // Селекторы для доступа к данным
  selectors: {
    getOrderLoading: (state) => state.orderRequest,
    getOrderError: (state) => state.orderError,
    getCreatedOrder: (state) => state.newOrder,

    getHistoryLoading: (state) => state.historyRequest,
    getOrderHistory: (state) => state.history,

    getCurrentOrder: (state) => state.selectedOrder,
    getCurrentOrderLoading: (state) => state.selectedOrderRequest,

    getLiveFeed: (state) => state.feed,
    getFeedLoading: (state) => state.feedRequest,
    getFeedError: (state) => state.feedError
  },
  // Синхронные действия
  reducers: {
    // Сброс данных о созданном заказе
    resetCreatedOrder(state) {
      state.newOrder = null;
    },
    // Установка ID выбранного заказа
    setOrderId(state, { payload }: PayloadAction<number | null>) {
      state.selectedOrderId = payload;
    }
  },
  // Обработка асинхронных действий
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.rejected, (state, { error }) => {
        state.orderRequest = false;
        state.orderError = error;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.newOrder = payload;
      })
      // История заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.historyRequest = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        state.historyRequest = false;
        state.history = payload;
      })
      // Детали заказа
      .addCase(fetchOrderDetails.pending, (state) => {
        state.selectedOrderRequest = true;
        state.selectedOrderError = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, { payload }) => {
        state.selectedOrderRequest = false;
        state.selectedOrderError = payload;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, { payload }) => {
        state.selectedOrderRequest = false;
        state.selectedOrder = payload;
      })
      // Лента заказов
      .addCase(fetchFeedData.pending, (state) => {
        state.feedRequest = true;
        state.feedError = null;
      })
      .addCase(fetchFeedData.rejected, (state, { payload }) => {
        state.feedRequest = false;
        state.feedError = payload;
      })
      .addCase(fetchFeedData.fulfilled, (state, { payload }) => {
        state.feedRequest = false;
        state.feed = payload;
      });
  }
});

export const orderActions = orderSlice.actions;
export const orderSystemReducer = orderSlice.reducer;
