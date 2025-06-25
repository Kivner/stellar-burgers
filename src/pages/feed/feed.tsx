import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { loadFeed } from '../../services/store/feeds/feeds-slice';
import { feedsSelectors, useDispatch, useSelector } from '../../services/store';
import { loadIngredients } from '../../services/store/ingredients/ingredients-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFeed());
    dispatch(loadIngredients());
  }, []);

  const feed = useSelector(feedsSelectors.selectFeed);
  const request = useSelector(feedsSelectors.selectFeedRequest);

  if (request || !feed) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feed.orders}
      handleGetFeeds={() => {
        dispatch(loadFeed());
      }}
    />
  );
};
