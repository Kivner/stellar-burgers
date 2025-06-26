import {
  fetchFeedData,
  orderActions,
  orderSystemReducer
} from '../order-slice';

jest.unmock('../../../../utils/burger-api.ts');

jest.mock('../../../../utils/burger-api.ts', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

describe('orderSystem actions', () => {
  it('очищает созданный заказ', () => {
    const initialState = {
      ...orderSystemReducer(undefined, { type: '' }),
      newOrder: {
        _id: 'order-123',
        status: 'done',
        name: 'Test Burger',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        number: 1234,
        ingredients: ['ing1', 'ing2']
      }
    };

    const state = orderSystemReducer(
      initialState,
      orderActions.resetCreatedOrder()
    );
    expect(state.newOrder).toBeNull();
  });

  it('устанавливает идентификатор заказа', () => {
    const state = orderSystemReducer(undefined, orderActions.setOrderId(4567));
    expect(state.selectedOrderId).toBe(4567);
  });
});

describe('orderSystem async операции', () => {
  it('устанавливает состояние загрузки при получении выдачи', () => {
    const state = orderSystemReducer(undefined, {
      type: fetchFeedData.pending.type
    });
    expect(state.feedRequest).toBe(true);
    expect(state.feedError).toBeNull();
  });

  it('выбирает успешным выдачи', () => {
    const mockFeed = {
      orders: [
        {
          _id: 'order-1',
          ingredients: ['ing1', 'ing2'],
          status: 'done',
          name: 'Burger',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 1
        }
      ],
      total: 100,
      totalToday: 10
    };

    const state = orderSystemReducer(undefined, {
      type: fetchFeedData.fulfilled.type,
      payload: mockFeed
    });

    expect(state.feed).toEqual(mockFeed);
    expect(state.feedRequest).toBe(false);
    expect(state.feedError).toBeNull();
  });

  it('обрабатывает ошибку выбора подачи', () => {
    const error = { message: 'Network error' };
    const state = orderSystemReducer(undefined, {
      type: fetchFeedData.rejected.type,
      payload: error
    });

    expect(state.feedError).toEqual(error);
    expect(state.feedRequest).toBe(false);
  });
});
