import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import {
  constructorSelectors,
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { clearConstructor } from '../../services/store/constructor/constructor-slice';
import { orderSlice, placeOrder } from '../../services/store/order/order-slice';

export const BurgerConstructor: FC = () => {
  // Add fallback values in case selectSelection returns undefined
  const { bun = null, ingredients = [] } =
    useSelector(constructorSelectors.selectSelection) || {};

  const orderModalData = useSelector(ordersSelectors.selectNewOrder);
  const orderRequest = useSelector(ordersSelectors.selectOrderRequest);
  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    dispatch(placeOrder([bun._id, ...ingredients.map((it) => it._id)]));
  };

  const closeOrderModal = () => {
    dispatch(orderSlice.actions.clearNewOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ing) => sum + ing.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
