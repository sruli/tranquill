import transmuter from './transmuter';

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
