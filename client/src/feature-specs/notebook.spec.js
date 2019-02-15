import api from '../api';
import mountApp from '../spec/helpers/mountApp';
import wait from '../spec/helpers/wait';
import { stubAuth, unstubAuth } from '../spec/helpers/authStubs';
import resetImportedMock from '../spec/helpers/resetImportedMock';
import getNotebookResponse from '../spec/fixtures/apiResponses/notebooks';

jest.mock('../api');

describe('notebook', () => {
  beforeAll(() => stubAuth());
  afterAll(() => unstubAuth());

  describe('when the notebook is loaded', () => {
    let wrapper;

    beforeEach(async () => {
      window.scrollTo = () => {};
      api.getNotebook.mockResolvedValue(getNotebookResponse({ name: 'Notebook', id: 1 }));
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    afterEach(async () => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('displays the notebook name', () => {
      expect(wrapper.find('NameSection').find('input').prop('value')).toEqual('Notebook');
    });
  });

  describe('when the notebook is loaded and there are contentBlocks', () => {
    let wrapper;

    beforeEach(async () => {
      window.scrollTo = () => {};
      api.getNotebook.mockResolvedValue(getNotebookResponse());
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    afterEach(async () => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('loads the contentBlocks into the Editor', () => {
      expect(wrapper.find('.public-DraftEditor-content').text()).toEqual('Some text');
    });

    it('focuses the editor at the end of the text', async () => {
      await wait(200); // wait for editorState to load and to set the focus
      wrapper.update();
      const editorState = wrapper.find('DraftEditor').prop('editorState');
      const lastContentBlock = editorState.getCurrentContent().getLastBlock();
      const selection = editorState.getSelection();
      expect(selection.getFocusOffset()).toEqual(lastContentBlock.getLength());
    });
  });

  describe('when the notebook is loaded and there are no contentBlocks', () => {
    let wrapper;

    beforeEach(async () => {
      window.scrollTo = () => {};
      const contentBlocks = { href: '', items: [] };
      api.getNotebook.mockResolvedValue(getNotebookResponse({ contentBlocks }));
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    afterEach(async () => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('loads the Editor in an empty state', () => {
      expect(wrapper.find('.public-DraftEditor-content').text()).toEqual('');
    });
  });

  describe('when draft editor state changes', () => {
    let wrapper;

    beforeEach(async () => {
      window.scrollTo = () => {};
      api.getNotebook.mockResolvedValue(getNotebookResponse({ name: 'Notebook', id: 1 }));
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    afterEach(async () => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('persists the editorState', async () => {
      const editorContent = wrapper.find('.public-DraftEditor-content');
      await editorContent.simulate('beforeInput', { data: 'Some text' });
      await wait(1); // wait 1ms for saga throttle
      wrapper.update();
      const saveArgs = api.saveEditorState.mock.calls[0][0];
      expect(saveArgs.notebookId).toBeTruthy();
      expect(saveArgs.rawEditorState).toBeTruthy();
    });

    it('includes the position of each content block in the saveEditorState() payload', async () => {
      const editorContent = wrapper.find('.public-DraftEditor-content');
      await editorContent.simulate('beforeInput', { data: 'Some text' });
      await wait(1); // wait 1ms for saga throttle
      wrapper.update();
      const saveArgs = api.saveEditorState.mock.calls[0][0];
      expect(saveArgs.rawEditorState.blocks[0]).toHaveProperty('position', 0);
    });
  });

  describe('when editor state changes and notebookId is null', () => {
    let wrapper;

    beforeEach(async () => {
      window.scrollTo = () => {};
      api.getNotebook.mockResolvedValue(getNotebookResponse({ name: 'Notebook', id: null }));
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    afterEach(async () => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('does not persist editor state', async () => {
      const editorContent = wrapper.find('.public-DraftEditor-content');
      await editorContent.simulate('beforeInput', { data: 'Some text' });
      await wait(1); // wait 1ms for saga throttle
      wrapper.update();
      expect(api.saveEditorState).not.toHaveBeenCalled();
    });
  });
});
