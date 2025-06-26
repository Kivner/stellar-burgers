import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { signout } from '../../services/store/user/user-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    dispatch(signout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
