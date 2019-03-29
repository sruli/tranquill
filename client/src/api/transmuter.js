import { convertFromRaw } from 'draft-js';
import url from 'url';

export default {
  getNotebooks: {
    fromServer(response) {
      const [latestNotebook] = response;
      if (!latestNotebook) return {};

      return {
        notebookPath: url.parse(latestNotebook.href).pathname,
      };
    },
  },
  getNotebook: {
    fromServer(response) {
      const { id, name, contentBlocks: { items, offset } } = response;

      const blocks = items.map((item) => {
        const { createdAt, updatedAt, notebook, position, ...rest } = item;
        return rest;
      });

      const editorState = blocks.length > 0
        ? convertFromRaw({
          blocks,
          entityMap: {},
        })
        : null;

      return {
        editorState,
        offset,
        notebook: { id, name },
      };
    },
  },
  saveEditorState: {
    /**
     * Adds a position to the content blocks so they can be persisted and
     * later retrieved & displayed in their correct order.
     */
    toServer({ notebookId, rawEditorState, offset }) {
      const { blocks } = rawEditorState;
      const blocksWithPosition = blocks.map((block, index) => ({
        ...block,
        position: offset + index,
      }));

      return {
        notebookId,
        rawEditorState: {
          ...rawEditorState,
          blocks: blocksWithPosition,
        },
        offset,
      };
    },
  },
  submitEmailSignup: {
    fromServer({ status, title }) {
      const ok = status === 'subscribed' || title === 'Member Exists';
      return { ok };
    },
  },
};
