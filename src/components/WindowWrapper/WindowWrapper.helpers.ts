import {
  CalculateElementSize,
  CalculatePercentageSize,
  CanResize,
  IsOutOfBounds,
  NodeAndParentData,
  NodeData,
  NodeRefStyle,
} from '@/components/WindowWrapper/WindowWrapper.type';
import { WindowWrapperState } from '@/components/WindowWrapper/WindowWrapper.state.type';

const isOutOfBounds: IsOutOfBounds = (nodeRect: NodeAndParentData, direction) => {
  const parent = nodeRect.parent.position;
  const elem = nodeRect.element.position;

  if (!parent) return false;

  const bounds = {
    x: elem.left <= parent.left || elem.right >= parent.right,
    y: elem.top <= parent.top || elem.bottom >= parent.bottom,
  };

  return direction === 'x' ? bounds.x : bounds.y;
};

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T];

const filterByKeys = <K extends NumericKeys<DOMRect>>(
  rect: DOMRect, keys: K[]): { [P in K]: number } => keys.reduce((acc, key) => {
    acc[key] = rect[key] as number;
    return acc;
  }, {} as { [P in K]: number });

export const getNodeAndParentSize = (element: HTMLElement | null): NodeAndParentData => {
  const sizes: NodeAndParentData = {
    element: {
      size: { width: 0, height: 0 },
      position: {
        top: 0, left: 0, right: 0, bottom: 0,
      },
    },
    parent: {
      size: { width: 0, height: 0 },
      position: {
        top: 0, left: 0, right: 0, bottom: 0,
      },
    },
  };

  if (!element) return sizes;

  const elementClientRect = element.getBoundingClientRect();
  const elementSize: NodeData['size'] = filterByKeys(elementClientRect, ['width', 'height']);
  const elementPosition = filterByKeys(elementClientRect, ['top', 'left', 'right', 'bottom']);

  sizes.element.size = elementSize;
  sizes.element.position = elementPosition;

  const parent = element.parentElement;

  if (!parent) return sizes;

  const parentClientRect = parent.getBoundingClientRect();
  const parentSize = filterByKeys(parentClientRect, ['width', 'height']);
  const parentPosition = filterByKeys(parentClientRect, ['top', 'left', 'right', 'bottom']);

  sizes.parent.size = parentSize;
  sizes.parent.position = parentPosition;

  return sizes;
};

export const canResize: CanResize = (
  handle,
  nodeRect,
  size,
  newSize,
) => {
  const isWidthHandle = ['e', 'w'].includes(handle);
  const isHeightHandle = ['s', 'n'].includes(handle);

  if (isWidthHandle && newSize.width > size.width && isOutOfBounds(nodeRect, 'x')) return false;

  return !(isHeightHandle && newSize.height > size.height && isOutOfBounds(nodeRect, 'y'));
};

export const calculateElementSize: CalculateElementSize = (
  nodeRect,
  percentageSize,
  limits,
) => {
  const parentSize = nodeRect.parent.size;

  return {
    width: Math.max(percentageSize.width * parentSize.width, limits[0]),
    height: Math.max(percentageSize.height * parentSize.height, limits[1]),
  };
};

export const calculatePercentageSize: CalculatePercentageSize = (
  nodeRect: NodeAndParentData,
  newWidth,
  newHeight,
) => {
  const parentSize = nodeRect.parent.size;

  if (parentSize.width === 0 || parentSize.height === 0) return { width: 1, height: 1 };

  return {
    width: newWidth / parentSize.width,
    height: newHeight / parentSize.height,
  };
};

export function getTranslateXY(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    x: matrix.m41,
    y: matrix.m42,
  };
}

export const getMaxCenteredTranslate = (nodeRect: NodeAndParentData) => {
  const maxTranslateX = (nodeRect.parent.size.width - nodeRect.element.size.width) / 2;
  const maxTranslateY = (nodeRect.parent.size.height - nodeRect.element.size.height) / 2;

  return {
    maxTranslateX,
    maxTranslateY,
  };
};

export const adjustTranslateWithinBounds = (
  nodeRect: NodeAndParentData,
  translate: { x: number, y: number },
) => {
  const { x, y } = translate;

  const { maxTranslateX, maxTranslateY } = getMaxCenteredTranslate(nodeRect);

  const translateX = x >= 0 ? Math.min(x, maxTranslateX) : Math.max(x, -maxTranslateX);
  const translateY = y >= 0 ? Math.min(y, maxTranslateY) : Math.max(y, -maxTranslateY);

  return { x: translateX, y: translateY };
};

export const nodeRefStyle = (
  state: WindowWrapperState,
  initialSize: { width: string, height: string },
): NodeRefStyle => {
  const style: Pick<NodeRefStyle, 'visibility' | 'borderRadius'> = {
    visibility: state.loading ? 'hidden' : 'visible',
    borderRadius: state.fullscreen ? '0' : undefined,
  };
  if (state.fullscreen) {
    return {
      width: '100%',
      height: '100%',
      ...style,
    };
  }
  return {
    width: state.size.width === 0 ? initialSize.width : `${state.size.width}px`,
    height: state.size.height === 0 ? initialSize.height : `${state.size.height}px`,
    ...style,
  };
};
