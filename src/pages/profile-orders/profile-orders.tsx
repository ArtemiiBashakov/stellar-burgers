import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { getOrdersApi } from '@api';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersApi()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Preloader />;
  return <ProfileOrdersUI orders={orders} />;
};
