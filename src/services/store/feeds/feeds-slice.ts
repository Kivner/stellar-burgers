// src/store/feeds/feeds-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IFeedState, TFeed, TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

const initialState: IFeedState = {
  feed: null,
  feedRequest: false,
  feedError: null
};

export const loadFeed = createAsyncThunk(
  'orders/loadFeed',
  async (_, { rejectWithValue }) => {
    const data = await getFeedsApi();
    if (!data.success) {
      return rejectWithValue(data);
    }
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    } as TFeed;
  }
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  selectors: {
    selectFeed: (state) => state.feed,
    selectFeedRequest: (state) => state.feedRequest,
    selectFeedError: (state) => state.feedError
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.pending, (state) => {
        state.feedRequest = true;
        state.feedError = null;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.feedRequest = false;
        state.feedError = action.payload;
      })
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.feedRequest = false;
        state.feed = action.payload;
      });
  }
});

//export const {} = feedsSlice.actions; // If you need actions

export default feedsSlice.reducer;
