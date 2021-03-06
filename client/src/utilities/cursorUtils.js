const viewportHeight = document.documentElement.clientHeight;
let isLastLine = false;

const scrollViewport = function srollViewport() {
  setTimeout(() => window.scrollBy(0, 50), 1);
};

const enforceCursorLocation = function enforceCursorLocation(e) {
  if (!window.getSelection) return;

  if (e && e.key === 'Enter' && isLastLine) return scrollViewport();

  const selection = window.getSelection();
  const range = selection.rangeCount > 0 && selection.getRangeAt(0);

  if (!range || range.endOffset === 0 || range.endContainer.nodeName !== '#text') return;

  const clonedRange = range.cloneRange();

  clonedRange.setStart(range.endContainer, range.endOffset - 1);
  clonedRange.setEnd(range.endContainer, range.endOffset);

  const { top = 0 } = clonedRange.getBoundingClientRect();
  clonedRange.detach();

  isLastLine = (viewportHeight - top) < 130;

  if ((viewportHeight - top) < 100) scrollViewport();
};

export default enforceCursorLocation;
