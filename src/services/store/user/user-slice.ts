// src/store/user/user-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, TLoginData, TRegisterData, IUserState } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie';

const initialState: IUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  registerUserRequest: false,
  updateUserError: null,
  updateUserRequest: false
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData) => {
    try {
      const data = await registerUserApi(userData);
      if (data.success) {
        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.user;
      }
      return Promise.reject(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => {
    try {
      const data = await loginUserApi(userData);
      if (data.success) {
        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.user;
      }
      return Promise.reject(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  try {
    const data = await getUserApi();
    if (data.success) {
      return data.user;
    }
    return Promise.reject(data);
  } catch (error) {
    return Promise.reject(error);
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>, { dispatch }) => {
    try {
      const data = await updateUserApi(userData);
      if (data.success) {
        dispatch(getUser());
        return data.user;
      }
      return Promise.reject(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    try {
      const response = await logoutApi();
      if (response.success) {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userSlice.actions.userLogout());
        return;
      }
      return Promise.reject(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(userSlice.actions.authChecked());
      });
    } else {
      dispatch(userSlice.actions.authChecked());
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  selectors: {
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserData: (state) => state.data,
    selectLoginRequest: (state) => state.loginUserRequest,
    selectLoginError: (state) => state.loginUserError,
    selectRegisterRequest: (state) => state.registerUserRequest,
    selectRegisterError: (state) => state.registerUserError,
    selectUpdateUserRequest: (state) => state.updateUserRequest,
    selectUpdateUserError: (state) => state.updateUserError
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Login failed';
        state.isAuthChecked = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = action.error.message || 'Registration failed';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.registerUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {})
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.data = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Update user failed';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      });
  }
});
