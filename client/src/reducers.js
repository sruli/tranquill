import { SCENE_NAME as notebook, reducer as notebookReducer } from './scenes/notebook';

const reducers = {
  [notebook]: notebookReducer,
};

export default reducers;
