import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { authSystemReducer, userSlice } from './store/user/user-slice';
import {
  burgerConstructorReducer,
  constructorToolkitSlice
} from './store/constructor/constructor-slice';
import { orderSystemReducer, orderSlice } from './store/order/order-slice';

export const rootReducer = combineReducers({
  userSlice: authSystemReducer,
  constructorSlice: burgerConstructorReducer,
  orderSlice: orderSystemReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export const userSelectors = userSlice.getSelectors(
  (state: RootState) => state.userSlice
);
export const constructorSelectors = constructorToolkitSlice.getSelectors(
  (state: RootState) => state.constructorSlice
);
export const ordersSelectors = orderSlice.getSelectors(
  (state: RootState) => state.orderSlice
);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
