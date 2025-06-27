import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { fetchFeedData } from '../../services/store/order/order-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  // Получаем данные из Redux store
  const feed = useSelector(ordersSelectors.getLiveFeed);
  const loading = useSelector(ordersSelectors.getFeedLoading);

  // Эффект для загрузки данных при монтировании компонента
  useEffect(() => {
    dispatch(fetchFeedData());
  }, []);

  // Показываем Preloader во время загрузки
  if (loading || !feed) {
    return <Preloader data-testid='preloader' />;
  }

  return (
    <FeedUI
      data-testid='feed'
      orders={feed.orders}
      handleGetFeeds={() => {
        dispatch(fetchFeedData());
      }}
    />
  );
};
