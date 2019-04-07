import draftJS, { createEmpty, createWithContent, moveFocusToEnd } from 'draft-js';
import { NOTEBOOK_RETRIEVED } from './actions';
import { editorStateReducer } from './reducer';
import contentBlocksApi from '../../spec/fixtures/apiResponses/contentBlocks';

const mockDraftJS = function mockDraftJS() {
  draftJS.EditorState.createEmpty = jest.fn();
  draftJS.EditorState.createWithContent = jest.fn();
  draftJS.EditorState.moveFocusToEnd = jest.fn();
};

const unmockDraftJS = function unmockDraftJS() {
  draftJS.EditorState.createEmpty = createEmpty;
  draftJS.EditorState.createWithContent = createWithContent;
  draftJS.EditorState.moveFocusToEnd = moveFocusToEnd;
};

describe('notebook reducer', () => {
  describe('editorStateReducer', () => {
    describe('when there are no content blocks', () => {
      let action;

      beforeEach(() => {
        mockDraftJS();

        action = {
          type: NOTEBOOK_RETRIEVED,
          payload: { blocks: [] },
        };
      });

      afterEach(() => {
        unmockDraftJS();
      });

      it('returns an empty editorState', () => {
        editorStateReducer(null, action);
        expect(draftJS.EditorState.createEmpty).toHaveBeenCalled();
        expect(draftJS.EditorState.createWithContent).not.toHaveBeenCalled();
      });
    });

    describe('when there are content blocks', () => {
      let action;
      let blocks;

      beforeEach(() => {
        mockDraftJS();

        blocks = contentBlocksApi.get().items;
        action = {
          type: NOTEBOOK_RETRIEVED,
          payload: { blocks },
        };
      });

      afterEach(() => {
        unmockDraftJS();
      });

      it('returns EditorState.createWithContent', () => {
        const content = draftJS.convertFromRaw({ blocks, entityMap: {} });
        editorStateReducer(null, action);
        expect(draftJS.EditorState.createEmpty).not.toHaveBeenCalled();
        expect(draftJS.EditorState.createWithContent).toHaveBeenCalledWith(content);
      });
    });
  });
});
