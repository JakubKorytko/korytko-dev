import {
  IConvertPercentageSize,
  IConvertTranslatePercentageSize, ISetRelativeness,
  ITurnOnFullscreen,
} from '@/components/WindowWrapper/WindowWrapper.state.type';

import {
  adjustTranslateWithinBounds,
  calculateElementSize,
  calculatePercentageSize,
} from '@/components/WindowWrapper/WindowWrapper.helpers';

export const convertTranslatePercentageSize: IConvertTranslatePercentageSize = (
  nodeRect,
  relTranslate,
  newSize,
) => {
  const updatedNodeRect = { ...nodeRect, element: { ...nodeRect.element, size: newSize } };
  const parentSize = updatedNodeRect.parent.size;

  const calculatedSize = {
    x: parentSize.width * relTranslate.x,
    y: parentSize.height * relTranslate.y,
  };

  return adjustTranslateWithinBounds(updatedNodeRect, calculatedSize);
};

export const turnOnFullscreen: ITurnOnFullscreen = (
  state,
  action,
) => {
  const { size } = state;
  const { min } = action.payload;
  const { nodeRect, translate: payloadTranslate } = action.payload;

  const { relativeToParent } = calculatePercentageSize(
    nodeRect,
    payloadTranslate,
    size,
  );

  const newSize = calculateElementSize(
    nodeRect,
    { width: 1, height: 1 },
    [min?.width ?? 50, min?.height ?? 50],
  );

  return {
    ...state,
    size: { ...newSize },
    relativeToParent: { ...relativeToParent },
    translate: {
      x: 0, y: 0,
    },
  };
};

export const convertPercentageSize: IConvertPercentageSize = (
  state,
  action,
) => {
  const newNodeRect = { ...action.payload.nodeRect };
  const { min } = action.payload;
  const { fullscreen } = action.payload;

  const newSize = fullscreen ? newNodeRect.parent.size : calculateElementSize(
    newNodeRect,
    state.relativeToParent,
    [min?.width ?? 50, min?.height ?? 50],
  );

  const translateSize = convertTranslatePercentageSize(
    newNodeRect,
    state.relativeToParent,
    newSize,
  );

  return {
    ...state,
    size: { ...newSize },
    translate: fullscreen ? state.translate : {
      ...state.translate,
      ...translateSize,
    },
    fullscreen,
  };
};

export const setRelativeness: ISetRelativeness = (state, action) => {
  const { payload } = action;

  const size = {
    width: payload.size?.width ?? state.relativeToParent.width,
    height: payload.size?.height ?? state.relativeToParent.height,
  };

  const translate = {
    x: payload.translate?.x ?? state.relativeToParent.x,
    y: payload.translate?.y ?? state.relativeToParent.y,
  };

  return {
    ...state,
    relativeToParent: {
      ...size,
      ...translate,
    },
  };
};
