import React, { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { verifyAuthStatus } from '../../services/store/user/user-slice';
import { ProtectedRoute } from '../protected-route';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { fetchAllIngredients } from '../../services/store/constructor/constructor-slice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // background location, хранит предыдущий маршрут
  const background = (location.state as { background?: Location })?.background;

  useEffect(() => {
    dispatch(verifyAuthStatus());
    dispatch(fetchAllIngredients());
  }, [dispatch]);

  // Обработчик закрытия модального окна
  const handleModalClose = useCallback(() => {
    if (background) {
      navigate(`${background.pathname}${background.search}`, {
        replace: true,
        state: {}
      });
      return;
    }
    navigate(-1);
  }, [background, navigate]);

  return (
    <div className={styles.app}>
      {/* Шапка приложения, отображается на всех страницах */}
      <AppHeader />

      {/* Основные маршруты приложения */}
      <Routes location={background || location}>
        {/* Главная страница с конструктором бургеров */}
        <Route path='/' element={<ConstructorPage />} />
        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />

        {/* Маршруты для авторизации (доступны только для неавторизованных) */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты профиля (только для авторизованных) */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Маршрут для несуществующих страниц */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Маршруты для модальных окон - рендерятся когда есть background location */}
      {background && (
        <Routes>
          {/* Модальное окно с деталями ингредиента */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          {/* Модальное окно с информацией о заказе из очереди */}
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          {/* Модальное окно с информацией о заказе из профиля */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
