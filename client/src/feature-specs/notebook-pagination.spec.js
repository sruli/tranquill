import api from '../api';
import mountApp from '../spec/helpers/mountApp';
import wait from '../spec/helpers/wait';
import { stubAuth, unstubAuth } from '../spec/helpers/authStubs';
import resetImportedMock from '../spec/helpers/resetImportedMock';
import getNotebookResponse from '../spec/fixtures/apiResponses/getNotebookResponse';
import contentBlocksApi from '../spec/fixtures/apiResponses/contentBlocks';

jest.mock('../api');

describe('notebook-pagination', () => {
  beforeEach(() => stubAuth());
  afterEach(() => unstubAuth());

  describe('happy path', () => {
    const loadMoreUrl = 'http://localhost:8080/notebooks/5c374963bb3224058cf7d2aa/contentBlocks?offset=0&limit=1';

    let eventMap;
    let wrapper;

    beforeEach(async () => {
      eventMap = {};
      window.addEventListener = jest.fn((event, cb) => {
        eventMap[event] = cb;
      });

      const initialContentBlocks = contentBlocksApi.get({
        offset: 1,
        previous: loadMoreUrl,
      });
      api.getNotebook.mockResolvedValue(getNotebookResponse({
        contentBlocks: initialContentBlocks,
      }));
      api.loadMoreContent.mockResolvedValue(contentBlocksApi.get({ offset: 0, limit: 1 }));
      const { app } = await mountApp({ path: '/notebooks/1' });
      await wait();
      wrapper = app.update();
    });

    afterEach(() => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('loads more content blocks when scrolled to the top', () => {
      eventMap.scroll();
      expect(api.loadMoreContent).toHaveBeenCalledWith(loadMoreUrl);
    });

    it('loads the new content into the draft editor', async () => {
      let editorState = wrapper.find('DraftEditor').prop('editorState');
      let contentBlocks = editorState.getCurrentContent().getBlockMap().toArray();
      expect(contentBlocks).toHaveLength(1);

      eventMap.scroll();
      await wait().then(() => wrapper.update());

      editorState = wrapper.find('DraftEditor').prop('editorState');
      contentBlocks = editorState.getCurrentContent().getBlockMap().toArray();
      expect(contentBlocks).toHaveLength(2);
    });

    it('maintains the focus selection', () => {
      const editorState = wrapper.find('DraftEditor').prop('editorState');
      const lastContentBlock = editorState.getCurrentContent().getLastBlock();
      const selection = editorState.getSelection();
      expect(selection.getFocusOffset()).toEqual(lastContentBlock.getLength());
    });
  });
});
