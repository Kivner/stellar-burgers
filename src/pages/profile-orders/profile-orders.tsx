import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { loadUserHistory } from '../../services/store/order/order-slice';
import {
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { loadIngredients } from '../../services/store/ingredients/ingredients-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const request = useSelector(ordersSelectors.selectHistoryRequest);
  const history = useSelector(ordersSelectors.selectHistory);

  useEffect(() => {
    dispatch(loadUserHistory());
    dispatch(loadIngredients());
  }, []);

  return request ? <Preloader /> : <ProfileOrdersUI orders={history} />;
};
