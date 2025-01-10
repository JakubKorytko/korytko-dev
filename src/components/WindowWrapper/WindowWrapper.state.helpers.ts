import {
  IConvertPercentageSize,
  IConvertTranslatePercentageSize,
  ISetSize,
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

export const convertPercentageSize: IConvertPercentageSize = (
  state,
  action,
  setFullscreen,
) => {
  const { size } = state;
  const newNodeRect = { ...action.payload.nodeRect };
  const fullscreen = setFullscreen ?? state.fullscreen;

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
    fullscreen,
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
