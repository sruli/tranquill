import { combineReducers } from 'redux';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import { SCENE_NAME } from './constants';
import { RESET } from '../../constants';
import {
  NOTEBOOK_RETRIEVED,
  LOAD_MORE_CONTENT,
  MORE_CONTENT_RETRIEVED,
  EDITOR_CHANGED,
} from './actions';

// selectors
export const getNotebookId = state => state[SCENE_NAME].id;
export const getNotebookName = state => state[SCENE_NAME].name;
export const getEditorState = state => state[SCENE_NAME].editorState;
export const getOffset = state => state[SCENE_NAME].offset;
export const getLoadMoreUrl = state => state[SCENE_NAME].loadMoreUrl;
export const getLoadingBusy = state => state[SCENE_NAME].loadingBusy;

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
      const { blocks } = action.payload;

      if (blocks.length > 0) {
        const content = convertFromRaw({ blocks, entityMap: {} });
        return EditorState.moveFocusToEnd(
          EditorState.createWithContent(content),
        );
      }

      return EditorState.moveFocusToEnd(
        EditorState.createEmpty(),
      );
    }
    case MORE_CONTENT_RETRIEVED: {
      const currentContentState = state.getCurrentContent();
      const currentBlockMap = currentContentState.getBlockMap();
      const currentSelection = state.getSelection();

      const { blocks } = action.payload;
      const newContentState = convertFromRaw({ blocks, entityMap: {} });
      const newBlockMap = newContentState.getBlockMap();

      const combinedBlockMap = newBlockMap.concat(currentBlockMap);
      const combinedContentState = ContentState.createFromBlockArray(combinedBlockMap.toArray());

      const stateNoUndo = EditorState.set(state, { allowUndo: false });
      const newState = EditorState.push(stateNoUndo, combinedContentState, 'insert-fragment');
      const stateAllowUndo = EditorState.set(newState, { allowUndo: true });
      const newStateWithSelection = EditorState.forceSelection(stateAllowUndo, currentSelection);

      return newStateWithSelection;
    }
    case EDITOR_CHANGED: {
      const { editorState } = action.payload;
      return editorState;
    }
    default:
      return state;
  }
};

const offsetReducer = (state = null, action) => {
  switch (action.type) {
    case NOTEBOOK_RETRIEVED:
    case MORE_CONTENT_RETRIEVED:
      return action.payload.offset;
    default:
      return state;
  }
};

const loadMoreUrlReducer = (state = null, action) => {
  switch (action.type) {
    case NOTEBOOK_RETRIEVED:
    case MORE_CONTENT_RETRIEVED:
      return action.payload.loadMoreUrl;
    default:
      return state;
  }
};

const loadingBusyReducer = (state = false, action) => {
  switch (action.type) {
    case LOAD_MORE_CONTENT:
      return true;
    case MORE_CONTENT_RETRIEVED:
      return false;
    default:
      return state;
  }
};

const reducer = combineReducers({
  id: idReducer,
  name: nameReducer,
  editorState: editorStateReducer,
  offset: offsetReducer,
  loadMoreUrl: loadMoreUrlReducer,
  loadingBusy: loadingBusyReducer,
});

export default reducer;
