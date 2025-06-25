export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TConstructorSelection = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export interface TConstructorState {
  items: TConstructorSelection;
}

export interface TIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  selectedIngredient: string | null;
}

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrdersState = {
  orderRequest: boolean;
  orderError: string | Error | null;
  newOrder: TOrder | null;
  history: TOrder[];
  historyRequest: boolean;
  selectedOrderId: null | unknown;
  selectedOrder: TOrder | null;
  selectedOrderRequest: boolean;
  selectedOrderError: string | Error | null;
};

export type TUser = {
  email: string;
  name: string;
};

export type IUserState = {
  data: null | TUser;

  isAuthChecked: boolean;
  isAuthenticated: boolean;

  loginUserError: string | Error | null;
  loginUserRequest: boolean;

  registerUserError: string | Error | null;
  registerUserRequest: boolean;

  updateUserError: string | Error | null;
  updateUserRequest: boolean;
};

export type TFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type IFeedState = {
  feed: TFeed | null;
  feedRequest: boolean;
  feedError: null | unknown;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};
