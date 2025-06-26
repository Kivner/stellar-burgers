import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  constructorSelectors,
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { constructorToolkitSlice } from '../../services/store/constructor/constructor-slice';
import {
  createOrder,
  orderSlice
} from '../../services/store/order/order-slice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(constructorSelectors.getSelectedItems);
  const orderModalData = useSelector(ordersSelectors.getCreatedOrder);
  const Loading = useSelector(ordersSelectors.getOrderLoading);
  const dispatch = useDispatch();

  // Обработчик оформления заказа
  const onOrderClick = () => {
    if (!constructorItems.bun || Loading) return;
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
      orderRequest={Loading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
