import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/feeds/actions';
import { Preloader } from '@ui';
import { getStoreLoadLogout } from '../../services/slices/user/userSlice';
import {
  getStoreLoadUserOrders,
  getStoreUserOrders
} from '../../services/slices/feeds/feedsSlice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(getStoreUserOrders);
  const dispatch = useDispatch();
  const isLogoutLoading = useSelector(getStoreLoadLogout);
  const isUserOrdersLoading = useSelector(getStoreLoadUserOrders);

  useEffect(() => {
    if (!orders.length) {
      dispatch(getUserOrders());
    }
  }, []);

  if (isLogoutLoading || isUserOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
