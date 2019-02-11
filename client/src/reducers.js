import { SCENE_NAME as notebook, reducer as notebookReducer } from './scenes/notebook';
import { SCENE_NAME as signIn, reducer as signInReducer } from './scenes/sign-in';
import { SERVICE_NAME as config, reducer as configReducer } from './services/config';

const reducers = {
  [notebook]: notebookReducer,
  [signIn]: signInReducer,
  [config]: configReducer,
};

export default reducers;
