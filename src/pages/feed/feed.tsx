import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedsData } from '../../services/slices/feeds/actions';
import {
  getStoreFeed,
  getStoreLoadFeed
} from '../../services/slices/feeds/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getStoreFeed);
  const isFeedLoading = useSelector(getStoreLoadFeed);

  useEffect(() => {
    dispatch(getFeedsData());
  }, []);

  if (isFeedLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsData());
      }}
    />
  );
};
