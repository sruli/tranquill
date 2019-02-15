import { combineReducers } from 'redux';
import has from 'has';
import { SCENE_NAME } from './constants';
import {
  FORM_CHANGED,
  FORM_SUBMITTED,
  FORM_VALIDATED,
  AUTHENTICATION_STARTED,
  AUTHENTICATION_COMPLETED,
} from './actions';

// selectors
export const getEmail = state => state[SCENE_NAME].email;
export const getPassword = state => state[SCENE_NAME].password;
export const getValidate = state => state[SCENE_NAME].validate;
export const getErrors = state => state[SCENE_NAME].errors;
export const getSubmitting = state => state[SCENE_NAME].submitting;

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
    case AUTHENTICATION_COMPLETED: {
      const { error } = action;
      if (error) return state;
      return '';
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
    case AUTHENTICATION_COMPLETED: {
      const { error } = action;
      if (error) return state;
      return '';
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

const errorsReducer = (state = [], action) => {
  switch (action.type) {
    case AUTHENTICATION_COMPLETED:
    case FORM_VALIDATED: {
      const { meta } = action;
      return meta || [];
    }
    default:
      return state;
  }
};

const submittingReducer = (state = false, action) => {
  switch (action.type) {
    case AUTHENTICATION_STARTED:
      return true;
    case AUTHENTICATION_COMPLETED:
      return false;
    default:
      return state;
  }
};

const reducer = combineReducers({
  email: emailReducer,
  password: passwordReducer,
  validate: validateReducer,
  errors: errorsReducer,
  submitting: submittingReducer,
});

export default reducer;
