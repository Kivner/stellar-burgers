import { authActions, authSystemReducer, signin } from '../user-slice';
import { TUser } from '@utils-types';

jest.unmock('../../../../utils/burger-api.ts');

jest.mock('../../../../utils/burger-api.ts', () => ({
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

describe('authSystem actions', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };
  it('проверка авторизации', () => {
    const state = authSystemReducer(undefined, authActions.markAsVerified());
    expect(state.isAuthChecked).toBe(true);
  });

  it('очистка даты после логаута', () => {
    const initialState = {
      ...authSystemReducer(undefined, { type: '' }),
      userInfo: mockUser,
      isAuthenticated: true
    };

    const state = authSystemReducer(initialState, authActions.clearUserData());
    expect(state.userInfo).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('authSystem async operations', () => {
  const mockUser: TUser = {
    email: 'user@domain.com',
    name: 'Test User'
  };
  it('происходит загрузка при логин', () => {
    const state = authSystemReducer(undefined, {
      type: signin.pending.type
    });
    expect(state.authLoading).toBe(true);
    expect(state.authError).toBeNull();
  });

  it('успешно выполняет логин', () => {
    const mockUser = {
      email: 'user@domain.com',
      name: 'Test User'
    };

    const state = authSystemReducer(undefined, {
      type: signin.fulfilled.type,
      payload: mockUser
    });

    expect(state.userInfo).toEqual(mockUser);
    expect(state.authLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle login error', () => {
    const error = {
      message: 'Authentication failed',
      code: '401'
    };

    const state = authSystemReducer(undefined, {
      type: signin.rejected.type,
      error
    });

    expect(state.authLoading).toBe(false);
    expect(state.authError).toEqual(error);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });
});
