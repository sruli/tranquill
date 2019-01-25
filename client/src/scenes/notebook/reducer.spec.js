import draftJs from 'draft-js';
import { NOTEBOOK_RETRIEVED } from './actions';
import { editorStateReducer } from './reducer';

jest.mock('draft-js');

describe('notebook reducer', () => {
  describe('editorStateReducer', () => {
    describe('when editorState is null', () => {
      let action;

      beforeEach(() => {
        action = {
          type: NOTEBOOK_RETRIEVED,
          payload: { editorState: null },
        };
      });

      afterEach(() => {
        draftJs.EditorState.createEmpty.mockReset();
        draftJs.EditorState.createWithContent.mockReset();
      });

      it('returns an empty editorState', () => {
        editorStateReducer(null, action);
        expect(draftJs.EditorState.createEmpty).toHaveBeenCalled();
        expect(draftJs.EditorState.createWithContent).not.toHaveBeenCalled();
      });
    });

    describe('when editorState is not null', () => {
      let action;
      let editorState;

      beforeEach(() => {
        editorState = 'not null';
        action = {
          type: NOTEBOOK_RETRIEVED,
          payload: { editorState },
        };
      });

      afterEach(() => {
        draftJs.EditorState.createEmpty.mockReset();
        draftJs.EditorState.createWithContent.mockReset();
      });

      it('returns EditorState.createWithContent', () => {
        editorStateReducer(null, action);
        expect(draftJs.EditorState.createEmpty).not.toHaveBeenCalled();
        expect(draftJs.EditorState.createWithContent).toHaveBeenCalledWith(editorState);
      });
    });
  });
});
