export const FORM_SUBMITTED = 'home.FORM_SUBMITTED';
export const FORM_CHANGED = 'home.FORM_CHANGED';
export const FORM_VALIDATED = 'home.FORM_VALIDATED';
export const EMAIL_SUBMIT_STARTED = 'home.EMAIL_SUBMIT_STARTED';
export const EMAIL_SUBMIT_COMPLETED = 'home.EMAIL_SUBMIT_COMPLETED';

export const formSubmitted = payload => ({
  payload,
  type: FORM_SUBMITTED,
});

export const formChanged = payload => ({
  payload,
  type: FORM_CHANGED,
});

export const formValidated = payload => ({
  payload,
  type: FORM_VALIDATED,
});

export const emailSubmitStarted = () => ({
  type: EMAIL_SUBMIT_STARTED,
});

export const emailSubmitCompleted = ({ ok }) => ({
  payload: {
    error: ok ? '' : 'Something went wrong. Try again.',
  },
  type: EMAIL_SUBMIT_COMPLETED,
});
