import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { registerNewUser } from '../../services/store/user/user-slice';
import { getErrorText } from '../../utils/error-utils';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const loading = useSelector(userSelectors.getRegistrationLoading);
  const error = useSelector(userSelectors.getRegistrationError);
  // Обработчик подтверждения регистрации
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerNewUser({
        name: values.userName,
        password: values.password,
        email: values.email
      })
    );
  };

  return loading ? (
    <Preloader />
  ) : (
    <RegisterUI
      errorText={getErrorText(error)}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={handleChange}
      setPassword={handleChange}
      setUserName={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
