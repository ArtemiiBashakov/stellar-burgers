import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectOrderError,
  clearCurrentOrder
} from '../../services/slices/orderSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const orderData = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
    return () => {
      dispatch(clearCurrentOrder()); // очищаем при размонтировании
    };
  }, [dispatch, number]);

  const orderInfo = orderData
    ? (() => {
        const date = new Date(orderData.createdAt);

        type TIngredientsWithCount = {
          [key: string]: (typeof ingredients)[0] & { count: number };
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
      })()
    : null;

  if (!orderData && !error) {
    return <Preloader />;
  }

  if (error || !orderInfo) {
    return <div>Ошибка загрузки заказа</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
