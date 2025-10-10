import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredientsData } from '../../services/slices/ingredients/actions';
import { getFeedsData } from '../../services/slices/feeds/actions';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';
import { checkAuthUser } from '../../services/slices/user/actions';
import { Wrapper } from '@ui';
import { getLastArg } from '../../utils/helpers';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;
  const orderNumber = location.state?.number;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getIngredientsData());
    dispatch(getFeedsData());
    dispatch(checkAuthUser());
  }, []);

  const onCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/ingredients/:id'
          element={
            <Wrapper title='Детали ингредиента'>
              <IngredientDetails />
            </Wrapper>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Wrapper title={'#0' + getLastArg(location.pathname)}>
              <OrderInfo />
            </Wrapper>
          }
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={
            <OnlyAuth
              component={
                <Wrapper title={'#0' + getLastArg(location.pathname)}>
                  <OrderInfo />
                </Wrapper>
              }
            />
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'#0' + orderNumber} onClose={onCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={'#0' + orderNumber} onClose={onCloseModal}>
                <OnlyAuth component={<OrderInfo />} />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
