import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Защита от undefined
        if (!state.ingredients) {
          state.ingredients = [];
        }

        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      if (!state.ingredients || state.ingredients.length === 0) {
        return;
      }
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedItem);
      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

// Селекторы теперь обращаются к burgerConstructor
export const selectConstructorItems = (state: any) => state.burgerConstructor;
export const selectConstructorBun = (state: any) =>
  state.burgerConstructor?.bun || null;
export const selectConstructorIngredients = (state: any) =>
  state.burgerConstructor?.ingredients || [];

export default constructorSlice.reducer;
