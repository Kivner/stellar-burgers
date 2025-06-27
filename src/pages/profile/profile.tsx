import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { UpdateUserProfile } from '../../services/store/user/user-slice';
import { getErrorText } from '../../utils/error-utils';

export const Profile: FC = () => {
  const user = useSelector(userSelectors.getUserProfile)!;
  const request = useSelector(userSelectors.getProfileUpdateStatus);
  const error = useSelector(userSelectors.getProfileUpdateError);
  const dispatch = useDispatch();

  // Состояние формы с инициализацией значений из профиля пользователя
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '' // Пароль изначально пустой
  });

  // Синхронизация формы при изменении данных пользователя
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  // Проверка изменений в форме
  const isChanged = useMemo(
    () =>
      formData.name !== user?.name ||
      formData.email !== user?.email ||
      formData.password !== '',
    [formData, user]
  );

  // Обработчики событий
  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(UpdateUserProfile(formData));
  };

  const handleFormReset = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return request ? (
    <Preloader />
  ) : (
    <ProfileUI
      formValue={formData}
      isFormChanged={isChanged}
      handleCancel={handleFormReset}
      handleSubmit={handleFormSubmit}
      handleInputChange={handleFieldChange}
      updateUserError={getErrorText(error)}
    />
  );
};
