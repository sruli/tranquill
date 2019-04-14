import { ClientError, ServerError } from '../../errors';

export const FORM_CHANGED = 'sign-in.FORM_CHANGED';
export const FORM_SUBMITTED = 'sign-in.FORM_SUBMITTED';
export const FORM_VALIDATED = 'sign-in.FORM_VALIDATED';
export const AUTHENTICATION_STARTED = 'sign-in.AUTHENTICATION_STARTED';
export const AUTHENTICATION_COMPLETED = 'sign-in.AUTHENTICATION_COMPLETED';

export const formChanged = payload => ({
  payload,
  type: FORM_CHANGED,
});

export const formSubmitted = () => ({
  type: FORM_SUBMITTED,
});

export const formValidated = payload => ({
  payload,
  type: FORM_VALIDATED,
});

export const authenticationStarted = () => ({
  type: AUTHENTICATION_STARTED,
});

export const authenticationCompleted = ({ ok, status } = {}) => {
  const action = { type: AUTHENTICATION_COMPLETED };

  if (ok) {
    return action;
  }

  if (status >= 400 && status < 500) {
    return {
      ...action,
      payload: {
        errors: [new ClientError()],
      },
    };
  }

  if (status >= 500) {
    return {
      ...action,
      payload: {
        errors: [new ServerError()],
      },
    };
  }
};
