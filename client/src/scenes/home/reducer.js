import { combineReducers } from 'redux';
import isNil from 'lodash/isNil';
import { SCENE_NAME, FORM_STATUS } from './constants';
import {
  FORM_CHANGED,
  FORM_SUBMITTED,
  FORM_VALIDATED,
  EMAIL_SUBMIT_STARTED,
  EMAIL_SUBMIT_COMPLETED,
} from './actions';

const { UNSUBMITTED, SUBMITTING, SUBMITTED } = FORM_STATUS;

// selectors
export const getEmail = state => state[SCENE_NAME].email;
export const getValidate = state => state[SCENE_NAME].validate;
export const getError = state => state[SCENE_NAME].error;
export const getStatus = state => state[SCENE_NAME].status;
export const getButtonDisabled = state => (
  !isNil(getError(state)) || [SUBMITTING, SUBMITTED].includes(getStatus(state))
);

// reducers
const emailReducer = (state = '', action) => {
  switch (action.type) {
    case FORM_CHANGED: {
      const { email } = action.payload;
      return email;
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

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case FORM_VALIDATED:
    case EMAIL_SUBMIT_COMPLETED:
      return action.payload.error;
    default:
      return state;
  }
};

const statusReducer = (state = UNSUBMITTED, action) => {
  switch (action.type) {
    case EMAIL_SUBMIT_STARTED:
      return SUBMITTING;
    case EMAIL_SUBMIT_COMPLETED:
      return action.payload.error ? UNSUBMITTED : SUBMITTED;
    default:
      return state;
  }
};

const reducer = combineReducers({
  email: emailReducer,
  validate: validateReducer,
  error: errorReducer,
  status: statusReducer,
});

export default reducer;
