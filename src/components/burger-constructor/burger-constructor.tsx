import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  constructorSelectors,
  ordersSelectors,
  useDispatch,
  userSelectors,
  useSelector
} from '../../services/store';
import { constructorToolkitSlice } from '../../services/store/constructor/constructor-slice';
import {
  createOrder,
  orderSlice
} from '../../services/store/order/order-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const constructorItems = useSelector(constructorSelectors.getSelectedItems);
  const orderModalData = useSelector(ordersSelectors.getCreatedOrder);
  const loading = useSelector(ordersSelectors.getOrderLoading);
  const isAuth = useSelector(userSelectors.getUserProfile);
  const dispatch = useDispatch();

  // Обработчик оформления заказа
  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || loading) return;
    dispatch(
      createOrder([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((it) => it._id)
      ])
    );
  };

  // Обработчик закрытия модального окна заказа
  const closeOrderModal = () => {
    dispatch(orderSlice.actions.resetCreatedOrder());
    dispatch(constructorToolkitSlice.actions.resetConstructor());
  };

  // Вычисляем общую стоимость бургера с мемоизацией
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={loading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
