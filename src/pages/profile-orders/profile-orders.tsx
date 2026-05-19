import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/slices/feedSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

export const ProfileOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const loading = useAppSelector(selectUserOrdersLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
