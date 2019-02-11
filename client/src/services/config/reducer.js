import { AUTHENTICATION_COMPLETED } from '../../scenes/sign-in/actions';

export const defaultState = { authenticated: false };
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case AUTHENTICATION_COMPLETED: {
      const { error } = action;
      return {
        ...state,
        authenticated: !error,
      };
    }
    default:
      return state;
  }
};

export default reducer;
