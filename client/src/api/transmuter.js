export default {
  saveEditorState: {
    /**
     * Adds a position to the content blocks so they can be persisted and
     * later retrieved & displayed in their correct order.
     */
    toServer(params) {
      const { blocks } = params.rawEditorState;
      const blocksWithPosition = blocks.map((block, index) => ({
        ...block,
        position: index,
      }));

      return {
        ...params,
        rawEditorState: {
          ...params.rawEditorState,
          blocks: blocksWithPosition,
        },
      };
    },
  },
};
