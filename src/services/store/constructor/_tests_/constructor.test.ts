import {
  burgerConstructorReducer,
  constructorToolkitSlice,
  fetchAllIngredients
} from '../constructor-slice';
import { TIngredient } from '@utils-types';

jest.unmock('../../../../utils/burger-api.ts');

jest.mock('../../../../utils/burger-api.ts', () => ({
  getIngredientsApi: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const mockIngredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Test Sauce',
  type: 'sauce',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 200,
  image: 'image-url',
  image_mobile: 'mobile-image-url',
  image_large: 'large-image-url'
};

const mockBun = {
  ...mockIngredient,
  type: 'bun'
};

describe('burgerConstructorReducer', () => {
  it('добавляет ингредиент', () => {
    const state = burgerConstructorReducer(
      undefined,
      constructorToolkitSlice.actions.addNewIngredient(mockIngredient)
    );
    expect(state.items.ingredients).toHaveLength(1);
    expect(state.items.ingredients[0].id).toBe('test-uuid');
  });

  it('удаляет ингредиент', () => {
    const withIngredient = burgerConstructorReducer(
      undefined,
      constructorToolkitSlice.actions.addNewIngredient(mockIngredient)
    );
    const state = burgerConstructorReducer(
      withIngredient,
      constructorToolkitSlice.actions.removeIngredient('test-uuid')
    );
    expect(state.items.ingredients).toHaveLength(0);
  });

  it('перемещает ингредиент вверх', () => {
    const initialState = {
      ...burgerConstructorReducer(undefined, { type: '' }),
      items: {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'item-1' },
          { ...mockIngredient, id: 'item-2' }
        ]
      }
    };
    const state = burgerConstructorReducer(
      initialState,
      constructorToolkitSlice.actions.shiftIngredientUp('item-2')
    );
    expect(state.items.ingredients[0].id).toBe('item-2');
    expect(state.items.ingredients[1].id).toBe('item-1');
  });

  it('перемещает ингредиент вниз', () => {
    const initialState = {
      ...burgerConstructorReducer(undefined, { type: '' }),
      items: {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'item-1' },
          { ...mockIngredient, id: 'item-2' }
        ]
      }
    };
    const state = burgerConstructorReducer(
      initialState,
      constructorToolkitSlice.actions.shiftIngredientDown('item-1')
    );
    expect(state.items.ingredients[0].id).toBe('item-2');
    expect(state.items.ingredients[1].id).toBe('item-1');
  });

  it('добавляет булку', () => {
    const state = burgerConstructorReducer(
      undefined,
      constructorToolkitSlice.actions.addNewIngredient(mockBun)
    );
    expect(state.items.bun).toEqual({ ...mockBun, id: 'bun' });
  });

  it('устанавливает выбранный ингредиент', () => {
    const state = burgerConstructorReducer(
      undefined,
      constructorToolkitSlice.actions.setSelectedIngredient('ingredient-1')
    );
    expect(state.selectedIngredient).toBe('ingredient-1');
  });

  it('очищает конструктор', () => {
    const filledState = {
      ...burgerConstructorReducer(undefined, { type: '' }),
      items: {
        bun: { ...mockBun, id: 'bun' },
        ingredients: [{ ...mockIngredient, id: 'test-uuid' }]
      }
    };

    const clearedState = burgerConstructorReducer(
      filledState,
      constructorToolkitSlice.actions.resetConstructor()
    );

    expect(clearedState.items.bun).toBeNull();
  });

  it('выбирает текущий ингредиент', () => {
    const state = {
      ingredients: [mockIngredient],
      selectedIngredient: 'ingredient-1',
      items: { bun: null, ingredients: [] },
      ingredientsRequest: false
    };

    const selected = constructorToolkitSlice.selectors.getCurrentIngredient({
      burgerConstructor: state
    });
    expect(selected?._id).toBe('ingredient-1');
  });

  it('возвращает null если ингредиент не найден', () => {
    const state = {
      ingredients: [],
      selectedIngredient: 'unknown-id',
      items: { bun: null, ingredients: [] },
      ingredientsRequest: false
    };

    const selected = constructorToolkitSlice.selectors.getCurrentIngredient({
      burgerConstructor: state
    });
    expect(selected).toBeNull();
  });
});

describe('constructorToolkitSlice асинхронные функции', () => {
  const mockIngredientsList: TIngredient[] = [mockIngredient];

  it('устанавливает флаг загрузки', () => {
    const state = burgerConstructorReducer(undefined, {
      type: fetchAllIngredients.pending.type
    });
    expect(state.ingredientsRequest).toBe(true);
  });

  it('добавляет ингредиенты при успешной загрузке', () => {
    const state = burgerConstructorReducer(undefined, {
      type: fetchAllIngredients.fulfilled.type,
      payload: mockIngredientsList
    });
    expect(state.ingredients).toEqual(mockIngredientsList);
    expect(state.ingredientsRequest).toBe(false);
  });
});
