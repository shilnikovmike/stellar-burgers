import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  getStoreLoadAuthChecked,
  getStoreUserData
} from '../../services/slices/user/userSlice';

export const AppHeader: FC = () => {
  const { pathname } = useLocation();
  const user = useSelector(getStoreUserData);
  const isAuthCheck = useSelector(getStoreLoadAuthChecked);

  return (
    <AppHeaderUI
      userName={!isAuthCheck ? 'Проверка...' : user ? user.name : ''}
      pathname={pathname}
    />
  );
};
