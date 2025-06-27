import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { constructorToolkitSlice } from '../../services/store/constructor/constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Обработчик перемещения элемента вниз
    const handleMoveDown = () => {
      dispatch(
        constructorToolkitSlice.actions.shiftIngredientDown(ingredient.id)
      );
    };

    // Обработчик перемещения элемента вверх
    const handleMoveUp = () => {
      dispatch(
        constructorToolkitSlice.actions.shiftIngredientUp(ingredient.id)
      );
    };

    // Обработчик удаления элемента
    const handleClose = () => {
      dispatch(constructorToolkitSlice.actions.removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
