import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  loadIngredients,
  selectIngredient
} from '../../services/store/ingredients/ingredients-slice';
import {
  constructorSelectors,
  ingredientsSelectors,
  useDispatch
} from '../../services/store';
import { useParams } from 'react-router-dom';
import { constructorSlice } from '../../services/store/constructor/constructor-slice';
import { useSelector } from 'react-redux';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadIngredients());
  }, []);
  useEffect(() => {
    dispatch(selectIngredient(id ?? null));
    return () => {
      dispatch(selectIngredient(null));
    };
  }, [id]);

  const ingredientData = useSelector(
    ingredientsSelectors.selectSelectedIngredient
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
