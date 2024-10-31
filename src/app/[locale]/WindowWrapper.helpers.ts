import type {
  CalculateElementSize,
  CalculatePercentageSize,
  CanResize,
  IsOutOfBounds,
  Dimensions,
} from '@/app/[locale]/WindowWrapper.type';

const isOutOfBounds: IsOutOfBounds = (element, direction) => {
  const parent = element.parentElement?.getBoundingClientRect();
  const elem = element.getBoundingClientRect();

  if (!parent) return false;

  const bounds = {
    x: elem.left <= parent.left || elem.right >= parent.right,
    y: elem.top <= parent.top || elem.bottom >= parent.bottom,
  };

  return direction === 'x' ? bounds.x : bounds.y;
};

export const areDimensionsEqual = (
  dim1: Dimensions,
  dim2: Dimensions,
) => !(dim1.width !== dim2.width || dim1.height !== dim2.height);

export const canResize: CanResize = (
  handle,
  element,
  size,
  newSize,
) => {
  const isWidthHandle = ['e', 'w'].includes(handle);
  const isHeightHandle = ['s', 'n'].includes(handle);

  if (isWidthHandle && newSize.width > size.width && isOutOfBounds(element, 'x')) return false;

  if (isHeightHandle && newSize.height > size.height && isOutOfBounds(element, 'y')) return false;

  return true;
};

export const calculateElementSize: CalculateElementSize = (
  element,
  percentageSize,
  limits,
) => {
  const parent = element.parentElement?.getBoundingClientRect();

  if (!parent) return { width: 0, height: 0 };

  return {
    width: Math.max(percentageSize.width * parent.width, limits[0]),
    height: Math.max(percentageSize.height * parent.height, limits[1]),
  };
};

export const calculatePercentageSize: CalculatePercentageSize = (
  element,
  newWidth,
  newHeight,
) => {
  const parent = element.parentElement?.getBoundingClientRect();

  if (!parent) return { width: 1, height: 1 };

  return {
    width: newWidth / parent.width,
    height: newHeight / parent.height,
  };
};
