import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getStoreIngredients } from '../../services/slices/ingredients/ingredientsSlice';
import {
  getStoreFeed,
  getStoreUserOrders,
  getStoreCurrentOrder,
  getStoreLoadCurrentOrder
} from '../../services/slices/feeds/feedsSlice';
import { getOrderByNumber } from '../../services/slices/feeds/actions';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(getStoreIngredients);
  const feedOrders = useSelector(getStoreFeed);
  const userOrders = useSelector(getStoreUserOrders);
  const currentOrder = useSelector(getStoreCurrentOrder);
  const isOrderLoading = useSelector(getStoreLoadCurrentOrder);

  const orderNumber = Number(number);

  const orderData = useMemo(() => {
    if (!orderNumber) {
      return null;
    }

    return (
      feedOrders.find((item) => item.number === orderNumber) ??
      userOrders.find((item) => item.number === orderNumber) ??
      currentOrder
    );
  }, [feedOrders, userOrders, currentOrder, orderNumber]);

  useEffect(() => {
    if (!orderNumber || orderData || isOrderLoading) {
      return;
    }

    dispatch(getOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, orderData, isOrderLoading]);

  const orderInfo = useMemo(() => {
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

  if (!orderInfo || isOrderLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
