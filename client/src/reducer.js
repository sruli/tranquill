import { combineReducers } from 'redux';
import { SCENE as notebook, reducer as notebookReducer } from './scenes/notebook';

const reducer = combineReducers({
  [notebook]: notebookReducer,
});

export default reducer;
