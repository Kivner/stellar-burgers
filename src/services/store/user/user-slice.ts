import { TUserState } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';

const initialState: TUserState = {
  isAuthChecked: false, // Флаг завершения проверки авторизации
  isAuthenticated: false, // Статус аутентификации пользователя
  userInfo: null, // Данные пользователя
  authError: null, // Ошибка при входе
  authLoading: false, // Флаг загрузки при входе
  regError: null, // Ошибка при регистрации
  regLoading: false, // Флаг загрузки при регистрации
  profileUpdateError: null, // Ошибка при обновлении профиля
  profileUpdateLoading: false // Флаг загрузки при обновлении профиля
};

// Вход пользователя в аккаунт
export const signin = createAsyncThunk(
  'auth/signin',
  async (credentials: TLoginData, { rejectWithValue }) => {
    const response = await loginUserApi(credentials);
    if (!response.success) return rejectWithValue(response);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// Регистрация нового пользователя
export const registerNewUser = createAsyncThunk(
  'auth/signup',
  async (userData: TRegisterData, { rejectWithValue }) => {
    const result = await registerUserApi(userData);
    if (!result.success) return rejectWithValue(result);

    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

// Обновление профиля пользователя
export const UpdateUserProfile = createAsyncThunk(
  'auth/update',
  async (
    updatedData: Partial<TRegisterData>,
    { rejectWithValue, dispatch }
  ) => {
    const apiResponse = await updateUserApi(updatedData);
    if (!apiResponse.success) return rejectWithValue(apiResponse);

    dispatch(fetchCurrentUser());
    return apiResponse.user;
  }
);

// Выход пользователя из аккаунта
export const signout = createAsyncThunk('auth/signout', (_, { dispatch }) => {
  logoutApi()
    .then(() => {
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(authActions.clearUserData());
    })
    .catch(console.error);
});

// Получение данных текущего пользователя
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetch',
  async (_, { rejectWithValue }) => {
    const userData = await getUserApi();
    return userData.success ? userData.user : rejectWithValue(userData);
  }
);

// Проверка статуса авторизации
export const verifyAuthStatus = createAsyncThunk(
  'auth/verify',
  (_, { dispatch }) => {
    getCookie('accessToken')
      ? dispatch(fetchCurrentUser()).finally(() => {
          dispatch(authActions.markAsVerified());
        })
      : dispatch(authActions.markAsVerified());
  }
);

export const userSlice = createSlice({
  name: 'authSystem',
  initialState,
  // Синхронные редьюсеры
  reducers: {
    // Выполнен вход
    markAsVerified: (state) => {
      state.isAuthChecked = true;
    },
    // Очистка данных пользователя
    clearUserData: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    }
  },
  // Селекторы для доступа к данным
  selectors: {
    getAuthVerificationStatus: (state) => state.isAuthChecked,
    getUserProfile: (state) => state.userInfo,
    getAuthLoadingState: (state) => state.authLoading,
    getAuthError: (state) => state.authError,
    getRegistrationLoading: (state) => state.regLoading,
    getRegistrationError: (state) => state.regError,
    getProfileUpdateStatus: (state) => state.profileUpdateLoading,
    getProfileUpdateError: (state) => state.profileUpdateError
  },
  // Обработка асинхронных действий
  extraReducers: (builder) => {
    builder
      // Обработка состояний входа
      .addCase(signin.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(signin.rejected, (state, { error }) => {
        state.authLoading = false;
        state.authError = error;
        state.isAuthChecked = true;
      })
      .addCase(signin.fulfilled, (state, { payload }) => {
        state.userInfo = payload;
        state.authLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      // Обработка состояний регистрации
      .addCase(registerNewUser.pending, (state) => {
        state.regLoading = true;
        state.regError = null;
      })
      .addCase(registerNewUser.rejected, (state, { error }) => {
        state.regLoading = false;
        state.regError = error;
        state.isAuthChecked = true;
      })
      .addCase(registerNewUser.fulfilled, (state, { payload }) => {
        state.userInfo = payload;
        state.regLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      // Обработка состояний получения данных пользователя
      .addCase(fetchCurrentUser.pending, (state) => {})
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.userInfo = payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.userInfo = null;
      })
      // Обработка состояний обновления профиля
      .addCase(UpdateUserProfile.pending, (state) => {
        state.profileUpdateLoading = true;
        state.profileUpdateError = null;
      })
      .addCase(UpdateUserProfile.rejected, (state, { error }) => {
        state.profileUpdateLoading = false;
        state.profileUpdateError = error;
        state.isAuthChecked = true;
      })
      .addCase(UpdateUserProfile.fulfilled, (state, { payload }) => {
        state.userInfo = payload;
        state.profileUpdateLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      });
  }
});

export const authActions = userSlice.actions;
export const authSystemReducer = userSlice.reducer;
