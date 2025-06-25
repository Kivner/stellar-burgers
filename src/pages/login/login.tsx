import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { login } from '../../services/store/user/user-slice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const loading = useSelector(userSelectors.selectLoginRequest);
  const error = useSelector(userSelectors.selectLoginError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      login({
        email,
        password
      })
    );
  };

  const getErrorText = () => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'Registration failed';
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
