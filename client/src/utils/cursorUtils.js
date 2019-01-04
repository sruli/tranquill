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
