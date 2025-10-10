import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getStoreLoadAuthChecked,
  getStoreUserData
} from '../../services/slices/user/userSlice';

type TProtectedRouteProps = {
  component: React.JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  component,
  onlyUnAuth = false
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(getStoreLoadAuthChecked);
  const user = useSelector(getStoreUserData);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };

    return <Navigate to={from} />;
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <ProtectedRoute component={component} onlyUnAuth />;
