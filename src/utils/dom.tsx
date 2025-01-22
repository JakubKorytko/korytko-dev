// eslint-disable-next-line import/prefer-default-export
export const getRect = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const scroll = {
    top: document.documentElement.scrollTop,
    left: document.documentElement.scrollLeft,
  };

  return {
    top: rect.top + scroll.top,
    left: rect.left + scroll.left,
    bottom: rect.bottom + scroll.top,
    right: rect.right + scroll.left,
    x: rect.x + scroll.left,
    y: rect.y + scroll.top,
    width: rect.width,
    height: rect.height,
  };
};
