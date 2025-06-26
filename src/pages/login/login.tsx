import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { signin } from '../../services/store/user/user-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // Получение состояния из Redux store
  const loading = useSelector(userSelectors.getAuthLoadingState);
  const error = useSelector(userSelectors.getAuthError);

  // Обработчик входа в аккаунт
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(signin({ email, password }));
  };

  // Форматирование текста с ошибкой
  const getErrorText = () => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'Login failed';
  };

  return loading ? (
    <Preloader />
  ) : (
    <LoginUI
      errorText={getErrorText()}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
