import { SCENE_NAME as notebook, reducer as notebookReducer } from './scenes/notebook';
import { SCENE_NAME as signIn, reducer as signInReducer } from './scenes/sign-in';

const reducers = {
  [notebook]: notebookReducer,
  [signIn]: signInReducer,
};

export default reducers;
