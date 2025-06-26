/// <reference types="cypress" />

import { TUser } from '@utils-types';
import {
  authActions,
  authSystemReducer
} from '../../src/services/store/user/user-slice';

describe('Auth System Reducer and Actions', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  // Перехват всех запросов к бэкенду
  beforeEach(() => {
    cy.intercept('**/api/**', (req) => {
      req.headers['authorization'] = `Bearer fake-access-token`;
    }).as('backendRequest');
  });

  // Установка фейковых токенов перед тестом создания заказа
  context('When testing order creation', () => {
    beforeEach(() => {
      // Установка фейковых токенов в localStorage и cookie
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'fake-access-token');
    });

    afterEach(() => {
      // Очистка после теста
      window.localStorage.removeItem('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('should create order with fake tokens', () => {
      // Здесь будет тест создания заказа
    });
  });

  describe('Auth System Actions', () => {
    it('should mark as verified', () => {
      const state = authSystemReducer(undefined, authActions.markAsVerified());
      expect(state.isAuthChecked).to.be.true;
    });

    it('should clear user data after logout', () => {
      const initialState = {
        ...authSystemReducer(undefined, { type: '' }),
        userInfo: mockUser,
        isAuthenticated: true
      };

      const state = authSystemReducer(
        initialState,
        authActions.clearUserData()
      );
      expect(state.userInfo).to.be.null;
      expect(state.isAuthenticated).to.be.false;
    });
  });

  describe('Auth System Async Operations', () => {
    const mockUser: TUser = {
      email: 'user@domain.com',
      name: 'Test User'
    };

    it('should set loading state during login', () => {
      const state = authSystemReducer(undefined, {
        type: 'auth/signin/pending'
      });
      expect(state.authLoading).to.be.true;
      expect(state.authError).to.be.null;
    });

    it('should handle successful login', () => {
      const state = authSystemReducer(undefined, {
        type: 'auth/signin/fulfilled',
        payload: mockUser
      });

      expect(state.userInfo).to.deep.equal(mockUser);
      expect(state.authLoading).to.be.false;
      expect(state.isAuthenticated).to.be.true;
      expect(state.isAuthChecked).to.be.true;
    });

    it('should handle login error', () => {
      const error = {
        message: 'Authentication failed',
        code: '401'
      };

      const state = authSystemReducer(undefined, {
        type: 'auth/signin/rejected',
        error
      });

      expect(state.authLoading).to.be.false;
      expect(state.authError).to.deep.equal(error);
      expect(state.isAuthChecked).to.be.true;
      expect(state.isAuthenticated).to.be.false;
    });
  });
});
