import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { Preloader } from '@ui';
import { fetchAllIngredients } from '../../services/store/constructor/constructor-slice';
import { fetchUserOrders } from '../../services/store/order/order-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const history = useSelector(ordersSelectors.getOrderHistory);
  const request = useSelector(ordersSelectors.getHistoryLoading);

  // Эффект для загрузки данных при монтировании
  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchAllIngredients());
  }, []);

  return request ? <Preloader /> : <ProfileOrdersUI orders={history} />;
};
