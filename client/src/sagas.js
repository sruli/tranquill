import { sagas as notebookSagas } from './scenes/notebook';
import { sagas as signInSagas } from './scenes/sign-in';
import { sagas as appNavbarSagas } from './components/AppNavbar';

export default [
  notebookSagas,
  signInSagas,
  appNavbarSagas,
];
