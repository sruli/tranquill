import { sagas as notebookSagas } from './scenes/notebook';
import { sagas as signInSagas } from './scenes/sign-in';

export default [
  notebookSagas,
  signInSagas,
];
