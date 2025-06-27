import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { signin } from '../../services/store/user/user-slice';
import { useForm } from '../../hooks/useForm';
import { getErrorText } from '../../utils/error-utils';

export const Login: FC = () => {
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();

  const loading = useSelector(userSelectors.getAuthLoadingState);
  const error = useSelector(userSelectors.getAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(signin(values));
  };

  return loading ? (
    <Preloader />
  ) : (
    <LoginUI
      errorText={getErrorText(error)}
      email={values.email}
      setEmail={handleChange}
      password={values.password}
      setPassword={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
