export const SCENE_NAME = 'home';
export const SCENE_PATH = '/';
export const DEBOUNCE_MILISECONDS = process.env.NODE_ENV === 'test' ? 0 : 100;
export const FORM_STATUS = {
  UNSUBMITTED: 'unsubmitted',
  SUBMITTING: 'submitting',
  SUBMITTED: 'submitted',
};
