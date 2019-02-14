import { AUTHENTICATION_COMPLETED } from '../../scenes/sign-in/actions';
import { SIGN_OUT } from '../../components/AppNavbar/actions';

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
    case SIGN_OUT:
      return {
        ...state,
        authenticated: false,
      };
    default:
      return state;
  }
};

export default reducer;
