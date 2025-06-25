import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer } from './root-reducer';
import { userSlice } from './store/user/user-slice';
import { constructorSlice } from './store/constructor/constructor-slice';
import { ingredientsSlice } from './store/ingredients/ingredients-slice';
import { orderSlice } from './store/order/order-slice';
import { feedsSlice } from './store/feeds/feeds-slice';

// Создаем store
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const userSelectors = userSlice.getSelectors(
  (state: RootState) => state.user
);

export const constructorSelectors = constructorSlice.getSelectors(
  (state: RootState) => state.constructor
);

export const ingredientsSelectors = ingredientsSlice.getSelectors(
  (state: RootState) => state.ingredients
);

export const ordersSelectors = orderSlice.getSelectors(
  (state: RootState) => state.order
);

export const feedsSelectors = feedsSlice.getSelectors(
  (state: RootState) => state.feeds
);

// Типы для TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
