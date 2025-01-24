import { INodeRefStyle } from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  AdjustTranslateWithinBounds,
  CalculateElementSize,
  CalculatePercentageSize,
  CanResize,
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
          x: 0, y: 0, lastX: 0, lastY: 0,
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
        lastX: translateX / parentRect.width,
        lastY: translateY / parentRect.height,
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

export const canResize: CanResize = (dir, nodeRect, newSize) => {
  const parent = nodeRect.parent.position;
  if (!parent) return false;

  const elem = nodeRect.element.position;

  const bounds = {
    left: elem.left < parent.left,
    right: elem.right > parent.right,
    top: elem.top < parent.top,
    bottom: elem.bottom > parent.bottom,
  };

  const consistsOnlyOfBounds = (
    words: string[],
  ): words is ('top' | 'left' | 'bottom' | 'right')[] => words
    .map((word) => word in bounds)
    .every(Boolean);

  const keys = dir
    .split(/(?=[A-Z])/)
    .map((word) => word
      .toLowerCase());

  if (!consistsOnlyOfBounds(keys)) return false;

  const isOutOfBounds = keys
    .map((key) => bounds[key])
    .every(Boolean);

  const isBiggerThanParent = newSize.width > nodeRect.parent.size.width
      || newSize.height > nodeRect.parent.size.height;

  return !isBiggerThanParent || !isOutOfBounds;
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
  newWidth,
  newHeight,
) => {
  const { width, height } = nodeRect.parent.size;

  if (width === 0 || height === 0) {
    return {
      relativeToParent: {
        width: 1,
        height: 1,
      },
      translate: {
        lastX: 0,
        lastY: 0,
      },
    };
  }

  return {
    relativeToParent: {
      width: newWidth / width,
      height: newHeight / height,
    },
    translate: {
      lastX: translate.x / width,
      lastY: translate.y / height,
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

export const nodeRefStyle: INodeRefStyle = (
  state,
) => ({
  visibility: state.loading ? 'hidden' : undefined,
  borderRadius: state.fullscreen ? '0' : undefined,
  margin: 0,
});
