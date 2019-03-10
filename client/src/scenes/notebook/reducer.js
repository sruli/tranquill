import { combineReducers } from 'redux';
import { EditorState } from 'draft-js';
import { NOTEBOOK_RETRIEVED, EDITOR_CHANGED } from './actions';
import { SCENE_NAME } from './constants';
import { RESET } from '../../constants';

// selectors
export const getNotebookId = state => state[SCENE_NAME].id;
export const getNotebookName = state => state[SCENE_NAME].name;
export const getEditorState = state => state[SCENE_NAME].editorState;

// reducers
const idReducer = (state = '', action) => {
  switch (action.type) {
    case NOTEBOOK_RETRIEVED: {
      const { id } = action.payload.notebook;
      return id;
    }
    case RESET:
      return '';
    default:
      return state;
  }
};

const nameReducer = (state = '', action) => {
  switch (action.type) {
    case NOTEBOOK_RETRIEVED: {
      const { name } = action.payload.notebook;
      return name;
    }
    default:
      return state;
  }
};

export const editorStateReducer = (state = null, action) => {
  switch (action.type) {
    case NOTEBOOK_RETRIEVED: {
      const { editorState } = action.payload;

      if (editorState) {
        return EditorState.createWithContent(editorState);
      }

      return EditorState.createEmpty();
    }
    case EDITOR_CHANGED: {
      const { editorState } = action.payload;
      return editorState;
    }
    default:
      return state;
  }
};

const reducer = combineReducers({
  id: idReducer,
  name: nameReducer,
  editorState: editorStateReducer,
});

export default reducer;
