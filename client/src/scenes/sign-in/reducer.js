import { combineReducers } from 'redux';
import has from 'has';
import { SCENE_NAME } from './constants';
import { FORM_CHANGED, FORM_SUBMITTED, FORM_VALIDATED } from './actions';

// selectors
export const getEmail = state => state[SCENE_NAME].email;
export const getPassword = state => state[SCENE_NAME].password;
export const getValidate = state => state[SCENE_NAME].validate;
export const getErrors = state => state[SCENE_NAME].errors;

// reducers
const emailReducer = (state = '', action) => {
  switch (action.type) {
    case FORM_CHANGED: {
      const { payload } = action;

      if (has(payload, 'email')) {
        return payload.email;
      }

      return state;
    }
    default:
      return state;
  }
};

const passwordReducer = (state = '', action) => {
  switch (action.type) {
    case FORM_CHANGED: {
      const { payload } = action;

      if (has(payload, 'password')) {
        return payload.password;
      }

      return state;
    }
    default:
      return state;
  }
};

const validateReducer = (state = false, action) => {
  switch (action.type) {
    case FORM_SUBMITTED:
      return true;
    default:
      return state;
  }
};

// false means there are no errors.
const defaultErrorState = { email: false, password: false };
const errorsReducer = (state = defaultErrorState, action) => {
  switch (action.type) {
    case FORM_VALIDATED: {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
};

const reducer = combineReducers({
  email: emailReducer,
  password: passwordReducer,
  validate: validateReducer,
  errors: errorsReducer,
});

export default reducer;
