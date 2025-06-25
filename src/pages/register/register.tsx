import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { registerUser } from '../../services/store/user/user-slice';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(userSelectors.selectRegisterRequest);
  const error = useSelector(userSelectors.selectRegisterError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email,
        password,
        name: userName
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
    <RegisterUI
      errorText={getErrorText()}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
