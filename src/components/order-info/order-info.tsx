import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import {
  constructorSelectors,
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchAllIngredients } from '../../services/store/constructor/constructor-slice';
import { fetchOrderDetails } from '../../services/store/order/order-slice';

export const OrderInfo: FC = () => {
  const { number: id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(Number(id)));
      dispatch(fetchAllIngredients());
    }
  }, [id]);

  const orderData = useSelector(ordersSelectors.getCurrentOrder);
  const orderLoading = useSelector(ordersSelectors.getCurrentOrderLoading);
  const ingredients = useSelector(constructorSelectors.getAllIngredients);
  const ingredientsRequest = useSelector(constructorSelectors.getLoadingStatus);

  useEffect(() => {
    console.info(orderData, orderLoading);
  }, [orderData, orderLoading]);

  const orderInfo = useMemo(() => {
    if (orderLoading || ingredientsRequest) return null;
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
