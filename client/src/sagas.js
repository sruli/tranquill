import { sagas as homeSagas } from './scenes/home';
import { sagas as signInSagas } from './scenes/sign-in';
import { sagas as notebookSagas } from './scenes/notebook';
import { sagas as appNavbarSagas } from './components/AppNavbar';

export default [
  homeSagas,
  signInSagas,
  notebookSagas,
  appNavbarSagas,
];
