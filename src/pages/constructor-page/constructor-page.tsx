import {
  useSelector,
  useDispatch,
  constructorSelectors
} from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { fetchAllIngredients } from '../../services/store/constructor/constructor-slice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  // Получаем статус загрузки ингредиентов из Redux store
  const isIngredientsLoading = useSelector(
    constructorSelectors.getLoadingStatus
  );

  // Эффект для загрузки ингредиентов при монтировании компонента
  useEffect(() => {
    dispatch(fetchAllIngredients());
  }, []);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
