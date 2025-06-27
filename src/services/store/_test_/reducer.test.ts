import { rootReducer } from '../../store';
import { Action } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('передаёт неизвестный action', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' } as Action);

    expect(result.userSlice).toBeDefined();
    expect(result.orderSlice).toBeDefined();
    expect(result.constructorSlice).toBeDefined();
  });
});
