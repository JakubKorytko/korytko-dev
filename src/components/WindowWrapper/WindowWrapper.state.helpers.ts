import {
  IConvertPercentageSize,
  IConvertTranslatePercentageSize,
  ISetSize,
  ITurnOffFullscreen,
  ITurnOnFullscreen,
} from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  adjustTranslateWithinBounds,
  calculateElementSize,
  calculatePercentageSize,
} from '@/components/WindowWrapper/WindowWrapper.helpers';

export const convertTranslatePercentageSize: IConvertTranslatePercentageSize = (
  nodeRect,
  size,
  newSize,
) => {
  const updatedNodeRect = { ...nodeRect, element: { ...nodeRect.element, size: newSize } };
  const parentSize = updatedNodeRect.parent.size;

  const calculatedSize = {
    x: parentSize.width * size.translate.lastX,
    y: parentSize.height * size.translate.lastY,
  };

  return adjustTranslateWithinBounds(updatedNodeRect, calculatedSize);
};

export const turnOnFullscreen: ITurnOnFullscreen = (
  state,
  action,
) => {
  const { size } = state;
  const { nodeRect, translate: payloadTranslate } = action.payload;

  const { translate, relativeToParent } = calculatePercentageSize(
    nodeRect,
    payloadTranslate,
    size.width,
    size.height,
  );

  const newSize = calculateElementSize(
    nodeRect,
    { width: 1, height: 1 },
    [size.min.width, size.min.height],
  );

  return {
    ...state,
    size: {
      ...size,
      ...newSize,
      translate: {
        ...translate,
        x: 0,
        y: 0,
      },
      relativeToParent,
    },
    fullscreen: true,
  };
};

export const turnOffFullscreen: ITurnOffFullscreen = (
  state,
  action,
) => {
  const { size } = state;
  const newNodeRect = { ...action.payload.nodeRect };

  const newSize = calculateElementSize(
    newNodeRect,
    size.relativeToParent,
    [size.min.width, size.min.height],
  );

  const translateSize = convertTranslatePercentageSize(newNodeRect, size, newSize);

  return {
    ...state,
    size: {
      ...size,
      ...newSize,
      translate: {
        ...size.translate,
        ...translateSize,
      },
    },
    fullscreen: false,
  };
};

export const convertPercentageSize: IConvertPercentageSize = (
  state,
  action,
) => {
  const newNodeRect = { ...action.payload.nodeRect };
  const { size, fullscreen } = state;

  const newSize = fullscreen ? newNodeRect.parent.size : calculateElementSize(
    newNodeRect,
    size.relativeToParent,
    [size.min.width, size.min.height],
  );

  const translateSize = convertTranslatePercentageSize(newNodeRect, size, newSize);

  return {
    ...state,
    size: {
      ...size,
      ...newSize,
      translate: fullscreen ? size.translate : {
        ...size.translate,
        ...translateSize,
      },
    },
  };
};

export const setSize: ISetSize = (state, action) => {
  const { payload } = action;
  const { size } = state;

  return {
    ...state,
    size: {
      ...size,
      min: { ...(payload.min ?? size.min) },
      translate: {
        ...size.translate,
        ...(payload.translate ?? {}),
        ...(payload.translateLast ?? {}),
      },
      relativeToParent: { ...(payload.relativeToParent ?? size.relativeToParent) },
      ...(payload.size || {}),
    },
  };
};
