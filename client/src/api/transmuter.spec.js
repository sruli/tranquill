import { convertFromRaw } from 'draft-js';
import getNotebookResponse from '../spec/fixtures/apiResponses/notebooks';
import transmuter from './transmuter';

describe('transmuter', () => {
  describe('getNotebook', () => {
    describe('fromServer()', () => {
      let response;

      describe('happy path', () => {
        beforeEach(() => {
          response = getNotebookResponse();
        });

        it('transmutes the response into an object ready to be used by the notebook UI', () => {
          const expectedResult = {
            notebook: {
              id: '5c374963bb3224058cf7d2aa',
              name: 'First notebook',
            },
            editorState: convertFromRaw({
              blocks: [
                {
                  data: {},
                  depth: 0,
                  entityRanges: [],
                  inlineStyleRanges: [],
                  key: 'aergj',
                  text: 'Some text',
                  type: 'unstyled',
                },
              ],
              entityMap: {},
            }),
          };

          expect(transmuter.getNotebook.fromServer(response)).toEqual(expectedResult);
        });
      });

      describe('when the notebook does not have any content blocks', () => {
        beforeEach(() => {
          response = getNotebookResponse({
            contentBlocks: {
              href: '',
              items: [],
            },
          });
        });

        it('sets editorState to null', () => {
          const transmutedResponse = transmuter.getNotebook.fromServer(response);
          expect(transmutedResponse.editorState).toBeNull();
        });
      });
    });
  });

  describe('saveEditorState', () => {
    describe('toServer()', () => {
      let initialParams;

      beforeEach(() => {
        initialParams = {
          notebookId: 1,
          rawEditorState: {
            blocks: [
              { key: 'abcd', text: 'Some text' },
              { key: 'efgh', text: 'Some text' },
            ],
            entityMap: {},
          },
        };
      });

      it('adds a position element to the blocks in the rawEditorState.blocks array', () => {
        const expectedParams = {
          notebookId: 1,
          rawEditorState: {
            blocks: [
              { key: 'abcd', text: 'Some text', position: 0 },
              { key: 'efgh', text: 'Some text', position: 1 },
            ],
            entityMap: {},
          },
        };

        expect(
          transmuter.saveEditorState.toServer(initialParams),
        ).toEqual(expectedParams);
      });
    });
  });
});
