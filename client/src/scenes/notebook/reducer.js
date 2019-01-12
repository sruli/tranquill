import { NOTEBOOK_RETRIEVED } from './actions';
import { SCENE_NAME } from './constants';

export const getNotebookName = state => state[SCENE_NAME].name;

const reducer = (state = { name: '' }, action) => {
  switch (action.type) {
    case NOTEBOOK_RETRIEVED: {
      const { name } = action.payload.notebook;
      return {
        ...state,
        name,
      };
    }
    default:
      return state;
  }
};

export default reducer;
