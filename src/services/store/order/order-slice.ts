// src/store/order/order-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersState } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';

const initialState: TOrdersState = {
  orderError: null,
  orderRequest: false,
  newOrder: null,

  history: [],
  historyRequest: false,

  selectedOrder: null,
  selectedOrderError: null,
  selectedOrderId: null,
  selectedOrderRequest: false
};

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (ingredientIds: string[]) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const loadUserHistory = createAsyncThunk(
  'orders/loadUserHistory',
  async () => await getOrdersApi()
);

export const loadOrder = createAsyncThunk(
  'orders/loadOrder',
  async (id: number, { rejectWithValue, dispatch }) => {
    dispatch(orderSlice.actions.setSelectedOrderId(id));
    const data = await getOrderByNumberApi(id);
    if (!data.success) {
      return rejectWithValue(data);
    }
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderError: (state) => state.orderError,
    selectNewOrder: (state) => state.newOrder,

    selectHistoryRequest: (state) => state.historyRequest,
    selectHistory: (state) => state.history,

    selectSelectedOrder: (state) => state.selectedOrder,
    selectSelectedOrderRequest: (state) => state.selectedOrderRequest
  },
  reducers: {
    clearNewOrder(state) {
      state.newOrder = null;
    },
    setSelectedOrderId(state, action: PayloadAction<number | null>) {
      state.selectedOrderId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Place order failed';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.newOrder = action.payload;
      })
      .addCase(loadUserHistory.pending, (state) => {
        state.historyRequest = true;
      })
      .addCase(loadUserHistory.fulfilled, (state, action) => {
        state.historyRequest = false;
        state.history = action.payload;
      })
      .addCase(loadOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(loadOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Load order failed';
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.selectedOrder = action.payload;
      });
  }
});

export default orderSlice.reducer;
