import { INodeRefStyle } from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  AdjustTranslateWithinBounds,
  CalculateElementSize,
  CalculatePercentageSize,
  CanResize, GetNodeData,
  IsOutOfBounds,
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

  const bounds = {
    x: elem.left <= parent.left || elem.right >= parent.right,
    y: elem.top <= parent.top || elem.bottom >= parent.bottom,
  };

  return direction === 'x' ? bounds.x : bounds.y;
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
        top, left, right, bottom,
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
        top: parentRect.top,
        left: parentRect.left,
        right: parentRect.right,
        bottom: parentRect.bottom,
      },
    },
  };
};

export const canResize: CanResize = (handle, nodeRect, size, newSize) => {
  const isWidthHandle = ['e', 'w'].includes(handle);
  const isHeightHandle = ['s', 'n'].includes(handle);

  return !(
    (isWidthHandle && newSize.width > size.width && isOutOfBounds(nodeRect, 'x'))
      || (isHeightHandle && newSize.height > size.height && isOutOfBounds(nodeRect, 'y'))
  );
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
  centered,
) => {
  const maxTranslateX = (nodeRect.parent.size.width - nodeRect.element.size.width)
      / (centered ? 2 : 1);
  const maxTranslateY = (nodeRect.parent.size.height - nodeRect.element.size.height)
      / (centered ? 2 : 1);

  return {
    x: Math.min(Math.max(translate.x, -maxTranslateX), maxTranslateX),
    y: Math.min(Math.max(translate.y, -maxTranslateY), maxTranslateY),
  };
};

export const nodeRefStyle: INodeRefStyle = (
  state,
  initialSize,
) => ({
  visibility: state.loading ? 'hidden' : undefined,
  borderRadius: state.fullscreen ? '0' : undefined,
  width: state.size.width === 0 ? initialSize.width : `${state.size.width}px`,
  height: state.size.height === 0 ? initialSize.height : `${state.size.height}px`,
  margin: 0,
});
