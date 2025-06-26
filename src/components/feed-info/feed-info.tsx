import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { ordersSelectors, useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные ленты заказов из Redux store, feed точно будет
  const feed = useSelector(ordersSelectors.getLiveFeed)!;

  // Получаем готовые заказы
  const readyOrders = getOrders(feed.orders, 'done');

  // Получаем заказы в процессе
  const pendingOrders = getOrders(feed.orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
