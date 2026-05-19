import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  clearConstructor
} from '../../services/slices/constructorSlice';
import {
  createOrder,
  selectOrderRequest,
  selectOrderModalData,
  closeOrderModal
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const orderRequest = useAppSelector(selectOrderRequest);
  const orderModalData = useAppSelector(selectOrderModalData);
  const user = useAppSelector(selectUser);

  const safeIngredients = ingredients || [];

  // когда появляется orderModalData (заказ успешно создан) — очищаем конструктор
  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const getOrderIngredientsIds = useMemo(() => {
    const ids: string[] = [];
    if (bun) ids.push(bun._id);
    safeIngredients.forEach((item: TConstructorIngredient) =>
      ids.push(item._id)
    );
    if (bun) ids.push(bun._id);
    return ids;
  }, [bun, safeIngredients]);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = safeIngredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, safeIngredients]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;
    dispatch(createOrder(getOrderIngredientsIds));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const constructorItems = {
    bun: bun,
    ingredients: safeIngredients
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
