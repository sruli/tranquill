// This implementation needs to be better. It needs to take into account hitting return key as well.
// A possibly solution could be also to check the x position of the cursor in relation to it's
// container and know when it is at the end. Once there is no more room then we know that the next
// key stroke will have to be pushed up a line.

const VIEWPORT_HEIGHT = document.documentElement.clientHeight;

// eslint-disable-next-line import/prefer-default-export
export const enforceCursorLocation = function enforceCursorLocation() {
  if (!window.getSelection) return;

  const selection = window.getSelection();
  const range = selection.rangeCount > 0 && selection.getRangeAt(0);

  if (!range || range.endOffset === 0 || range.endContainer.nodeName !== '#text') return;

  const clonedRange = range.cloneRange();

  clonedRange.setStart(range.endContainer, range.endOffset - 1);
  clonedRange.setEnd(range.endContainer, range.endOffset);

  const { top = 0 } = clonedRange.getBoundingClientRect();
  clonedRange.detach();

  if ((VIEWPORT_HEIGHT - top) < 100) window.scrollBy(0, 30);
};
