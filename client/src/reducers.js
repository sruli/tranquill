import { SCENE_NAME as home, reducer as homeReducer } from './scenes/home';
import { SCENE_NAME as signIn, reducer as signInReducer } from './scenes/sign-in';
import { SCENE_NAME as notebook, reducer as notebookReducer } from './scenes/notebook';

const reducers = {
  [home]: homeReducer,
  [signIn]: signInReducer,
  [notebook]: notebookReducer,
};

export default reducers;
