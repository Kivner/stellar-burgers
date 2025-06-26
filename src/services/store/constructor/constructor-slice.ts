import { TConstructorState, TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { v4 as uuidv4 } from 'uuid';

const initialState: TConstructorState = {
  items: {
    bun: null, // Текущие выбранные булки (х2)
    ingredients: [] // Список выбранных ингредиентов
  },
  ingredients: [], // Полный список доступных ингредиентов
  ingredientsRequest: false, // Флаг загрузки ингредиентов
  selectedIngredient: null // ID выбранного ингредиента для просмотра
};

// Загрузка всех ингредиентов
export const fetchAllIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => await getIngredientsApi()
);

export const constructorToolkitSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  // Селекторы для доступа к данным
  selectors: {
    getSelectedItems: (state) => state.items, // Выбранные ингредиенты
    getAllIngredients: (state) => state.ingredients, // Все ингредиенты
    getLoadingStatus: (state) => state.ingredientsRequest, // Статус загрузки
    getCurrentIngredient: (state) =>
      state.ingredients.find((item) => item._id === state.selectedIngredient) ??
      null
  }, // Найти текущий выбранный ингредиент
  // Синхронные редьюсеры
  reducers: {
    // Добавление нового ингредиента
    addNewIngredient: (state, { payload }: PayloadAction<TIngredient>) => {
      payload.type === 'bun'
        ? (state.items.bun = { ...payload, id: 'bun' })
        : state.items.ingredients.push({
            ...payload,
            id: uuidv4()
          });
    },
    // Удаление ингредиента по id
    removeIngredient: (state, { payload }: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (item) => item.id !== payload
      );
    },
    // Перемещение ингредиента вверх
    shiftIngredientUp: (state, { payload }: PayloadAction<string>) => {
      const ingredientsArray = state.items.ingredients;
      const currentIndex = ingredientsArray.findIndex(
        (ing) => ing.id === payload
      );

      if (currentIndex > 0) {
        [ingredientsArray[currentIndex], ingredientsArray[currentIndex - 1]] = [
          ingredientsArray[currentIndex - 1],
          ingredientsArray[currentIndex]
        ];
      }
    },
    // Перемещение ингредиента вниз
    shiftIngredientDown: (state, { payload }: PayloadAction<string>) => {
      const ingredientsArray = state.items.ingredients;
      const currentIndex = ingredientsArray.findIndex(
        (ing) => ing.id === payload
      );

      if (currentIndex !== -1 && currentIndex < ingredientsArray.length - 1) {
        [ingredientsArray[currentIndex], ingredientsArray[currentIndex + 1]] = [
          ingredientsArray[currentIndex + 1],
          ingredientsArray[currentIndex]
        ];
      }
    },
    // Установка выбранного ингредиента для просмотра
    setSelectedIngredient: (
      state,
      { payload }: PayloadAction<string | null>
    ) => {
      state.selectedIngredient = payload;
    },
    // Сброс конструктора
    resetConstructor: (state) => {
      state.items = {
        bun: null,
        ingredients: []
      };
      state.selectedIngredient = null;
      state.ingredientsRequest = false;
    }
  },
  // Обработка асинхронных операций
  extraReducers: (builder) => {
    builder
      // Начало загрузки ингредиентов
      .addCase(fetchAllIngredients.pending, (state) => {
        state.ingredientsRequest = true;
      })
      // Успешная загрузка ингредиентов
      .addCase(fetchAllIngredients.fulfilled, (state, { payload }) => {
        state.ingredientsRequest = false;
        state.ingredients = payload;
      });
  }
});

export const burgerConstructorReducer = constructorToolkitSlice.reducer;
