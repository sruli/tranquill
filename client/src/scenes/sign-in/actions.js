export const FORM_CHANGED = 'sign-in.FORM_CHANGED';
export const FORM_SUBMITTED = 'sign-in.FORM_SUBMITTED';
export const FORM_VALIDATED = 'sign-in.FORM_VALIDATED';

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
