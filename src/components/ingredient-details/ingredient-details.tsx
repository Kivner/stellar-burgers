import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import {
  constructorSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { constructorToolkitSlice } from '../../services/store/constructor/constructor-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // Эффект для управления выбранным ингредиентом
  useEffect(() => {
    dispatch(constructorToolkitSlice.actions.setSelectedIngredient(id ?? null));
    return () => {
      dispatch(constructorToolkitSlice.actions.setSelectedIngredient(null));
    };
  }, [id]);

  // Получаем данные текущего ингредиента из Redux store
  const ingredientData = useSelector(constructorSelectors.getCurrentIngredient);

  // Если данные еще не загружены, показываем прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // Рендерим UI компонент с передачей данных ингредиента
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
