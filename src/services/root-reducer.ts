import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from './store/ingredients/ingredients-slice';
import { orderSlice } from './store/order/order-slice';
import { userSlice } from './store/user/user-slice';
import { feedsSlice } from './store/feeds/feeds-slice';
import { constructorSlice } from './store/constructor/constructor-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  order: orderSlice.reducer,
  user: userSlice.reducer,
  feeds: feedsSlice.reducer,
  constructor: constructorSlice.reducer
});
