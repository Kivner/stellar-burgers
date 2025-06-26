import { userSelectors, useSelector } from '../../services/store';
import { Navigate } from 'react-router';
import { Preloader } from '@ui';
import React from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  // Получаем статус проверки авторизации и данные пользователя
  const [isAuthChecked, user] = [
    useSelector(userSelectors.getAuthVerificationStatus),
    useSelector(userSelectors.getUserProfile)
  ];

  // Показываем загрузку пока проверяется авторизация
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (onlyUnAuth) {
    return user ? <Navigate to='/' replace /> : children;
  } else {
    return user ? children : <Navigate to='/login' replace />;
  }
};
