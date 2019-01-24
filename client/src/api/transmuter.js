import { convertFromRaw } from 'draft-js';

export default {
  getNotebook: {
    fromServer({ id, name, contentBlocks: { items } }) {
      const blocks = items.map((item) => {
        const { createdAt, updatedAt, notebook, position, ...rest } = item;
        return rest;
      });

      const editorState = convertFromRaw({
        blocks,
        entityMap: {},
      });

      return {
        editorState,
        notebook: { id, name },
      };
    },
  },
  saveEditorState: {
    /**
     * Adds a position to the content blocks so they can be persisted and
     * later retrieved & displayed in their correct order.
     */
    toServer({ notebookId, rawEditorState }) {
      const { blocks } = rawEditorState;
      const blocksWithPosition = blocks.map((block, index) => ({
        ...block,
        position: index,
      }));

      return {
        notebookId,
        rawEditorState: {
          ...rawEditorState,
          blocks: blocksWithPosition,
        },
      };
    },
  },
};
