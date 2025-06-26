import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { userSelectors, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(userSelectors.getUserProfile);
  return <AppHeaderUI userName={user?.name} />;
};
