import { FC, memo } from 'react';
import { useAppDispatch } from '../../services/hooks';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      if (index + 1 < totalItems) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }
    };

    const handleMoveUp = () => {
      if (index - 1 >= 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
