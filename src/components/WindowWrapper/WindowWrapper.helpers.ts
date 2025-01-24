import { ResizeHandle } from 'react-resizable';

import { INodeRefStyle } from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  AdjustTranslateWithinBounds,
  Bounds,
  CalculateElementSize,
  CalculatePercentageSize,
  CanResize,
  CenteredHandle,
  GetNodeData,
  IsOutOfBounds, ResizeDirection,
} from '@/components/WindowWrapper/WindowWrapper.type';

export const waitForAnimationsToFinish = (target: HTMLElement, callback: () => void) => {
  Promise.all(target.getAnimations().map((animation) => animation.finished)).then(() => {
    callback();
  });
};

const isOutOfBounds: IsOutOfBounds = (nodeRect, direction) => {
  const parent = nodeRect.parent.position;
  const elem = nodeRect.element.position;

  if (!parent) return false;

  const directions = {
    w: elem.left < parent.left,
    e: elem.right > parent.right,
    n: elem.top < parent.top,
    s: elem.bottom > parent.bottom,
  };

  const bounds: Bounds = {
    ...directions,
    x: directions.w || directions.e,
    y: directions.n || directions.s,
  };

  return bounds[direction];
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

// todo: remove this
const convert = (dir: ResizeDirection): ResizeHandle | false => {
  type ConversionObject = {
    top: 'n',
    right: 'e',
    bottom: 's',
    left: 'w',
  };

  const conversionObject: ConversionObject = {
    top: 'n',
    bottom: 's',
    left: 'w',
    right: 'e',
  };

  const isConvertible = (
    direction: ResizeDirection,
  ): direction is keyof ConversionObject => direction in conversionObject;

  if (!isConvertible(dir)) return false;

  return conversionObject[dir];
};

// designed for 4 directions: e, w, n, s
export const canResize: CanResize = (dir, nodeRect, size, newSize, centered) => {
  const handle = convert(dir);

  if (!handle) return false;

  const centeredHandle: CenteredHandle = {
    n: 'y', s: 'y', e: 'x', w: 'x',
  };

  const isCenteredHandleKey = (
    handler: ResizeHandle,
  ): handler is keyof CenteredHandle => handler in centeredHandle;

  if (!isCenteredHandleKey(handle)) return false;

  const widthGrow = newSize.width > size.width;
  const heightGrow = newSize.height > size.height;

  const direction = centered ? centeredHandle[handle] : handle;

  const isWidthHandle = ['e', 'w'].includes(handle);
  const isHeightHandle = ['s', 'n'].includes(handle);
  const isHandleOutOfBounds = isOutOfBounds(nodeRect, direction);
  const isBiggerThanParent = newSize.width > nodeRect.parent.size.width
      || newSize.height > nodeRect.parent.size.height;

  if (isWidthHandle && widthGrow && isHandleOutOfBounds) return false;
  if (isHeightHandle && heightGrow && isHandleOutOfBounds) return false;
  return !isBiggerThanParent;
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
