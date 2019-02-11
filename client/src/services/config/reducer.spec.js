import { AUTHENTICATION_COMPLETED } from '../../scenes/sign-in/actions';
import reducer, { defaultState } from './reducer';

describe('config reducer', () => {
  describe('AUTHENTICATION_COMPLETED', () => {
    describe('when there is an error', () => {
      it('sets authenticated to false', () => {
        const action = { type: AUTHENTICATION_COMPLETED, error: true };
        const result = reducer(defaultState, action);
        expect(result).toHaveProperty('authenticated', false);
      });
    });

    describe('when there is no error', () => {
      it('sets authenticated in to true', () => {
        const action = { type: AUTHENTICATION_COMPLETED, error: false };
        const result = reducer(defaultState, action);
        expect(result).toHaveProperty('authenticated', true);
      });
    });
  });
});
