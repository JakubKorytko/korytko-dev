import { Rnd } from 'react-rnd';

import {
  AdjustTranslateWithinBounds,
  CalculateElementSize,
  CalculatePercentageSize,
  GetNodeData,
} from '@/components/WindowWrapper/WindowWrapper.type';

export const resizeHandleClasses = {
  top: 'resize-top',
  right: 'resize-right',
  bottom: 'resize-bottom',
  left: 'resize-left',
  topRight: 'resize-topRight',
  bottomRight: 'resize-bottomRight',
  bottomLeft: 'resize-bottomLeft',
  topLeft: 'resize-topLeft',
};

export const waitForAnimationsToFinish = (target: HTMLElement, callback: () => void) => {
  Promise.all(target.getAnimations().map((animation) => animation.finished)).then(() => {
    callback();
  });
};

export const getNodeData: GetNodeData = (element) => {
  if (!element) {
    return {
      element: {
        size: { width: 0, height: 0 },
        position: {
          top: 0, left: 0, right: 0, bottom: 0,
        },
        translate: {
          x: 0,
          y: 0,
          relative: {
            x: 0, y: 0,
          },
        },
      },
      parent: {
        size: { width: 0, height: 0 },
        position: {
          top: 0, left: 0, right: 0, bottom: 0,
        },
      },
    };
  }

  const scroll = {
    top: document.documentElement.scrollTop,
    left: document.documentElement.scrollLeft,
  };

  const style = window.getComputedStyle(element);
  const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(style.transform);
  const {
    width, height, top, left, right, bottom,
  } = element.getBoundingClientRect();

  const parent = element.parentElement;
  const parentRect = parent
    ? parent.getBoundingClientRect()
    : {
      width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0,
    };

  return {
    element: {
      size: { width, height },
      position: {
        top: top + scroll.top,
        left: left + scroll.left,
        right: right + scroll.left,
        bottom: bottom + scroll.top,
      },
      translate: {
        x: translateX,
        y: translateY,
        relative: {
          x: translateX / parentRect.width,
          y: translateY / parentRect.height,
        },
      },
    },
    parent: {
      size: { width: parentRect.width, height: parentRect.height },
      position: {
        top: parentRect.top + scroll.top,
        left: parentRect.left + scroll.left,
        right: parentRect.right,
        bottom: parentRect.bottom,
      },
    },
  };
};

export const calculateElementSize: CalculateElementSize = (nodeRect, percentageSize, limits) => {
  const { width, height } = nodeRect.parent.size;

  return {
    width: Math.max(percentageSize.width * width, limits[0]),
    height: Math.max(percentageSize.height * height, limits[1]),
  };
};

export const calculatePercentageSize: CalculatePercentageSize = (
  nodeRect,
  translate,
  newSize,
) => {
  const { width, height } = nodeRect.parent.size;

  if (width === 0 || height === 0) {
    return {
      relativeToParent: {
        width: 1,
        height: 1,
        x: 0,
        y: 0,
      },
    };
  }

  return {
    relativeToParent: {
      width: newSize.width / width,
      height: newSize.height / height,
      x: translate.x / width,
      y: translate.y / height,
    },
  };
};

export const adjustTranslateWithinBounds: AdjustTranslateWithinBounds = (
  nodeRect,
  translate,
) => {
  const maxTranslateX = (nodeRect.parent.size.width - nodeRect.element.size.width);
  const maxTranslateY = (nodeRect.parent.size.height - nodeRect.element.size.height);

  return {
    x: Math.min(Math.max(translate.x, -maxTranslateX), maxTranslateX),
    y: Math.min(Math.max(translate.y, -maxTranslateY), maxTranslateY),
  };
};

export const getElement = (ref: Rnd | null) => ref?.getSelfElement() || null;

export const calculateCentered = (el: Rnd | null) => {
  const node = el?.getSelfElement();
  if (!node) return { x: 0, y: 0 };
  const parent = node.parentElement;
  if (!parent) return { x: 0, y: 0 };

  const { width: parentWidth, height: parentHeight } = parent.getBoundingClientRect();
  const { width: childWidth, height: childHeight } = node.getBoundingClientRect();

  return { x: (parentWidth - childWidth) / 2, y: (parentHeight - childHeight) / 2 };
};
