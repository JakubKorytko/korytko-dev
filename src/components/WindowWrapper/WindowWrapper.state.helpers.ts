import {
  ConvertPercentageSize,
  FixTranslate,
  SetNodeSize, SetSize,
  TurnOffFullscreen,
  TurnOnFullscreen,
  WindowWrapperState,
} from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  adjustTranslateWithinBounds,
  calculateElementSize,
  calculatePercentageSize,
  isOutOfAnyBounds,
} from '@/components/WindowWrapper/WindowWrapper.helpers';

export const turnOnFullscreen = (state: WindowWrapperState, action: TurnOnFullscreen) => {
  const storedData = { ...state.storedData };
  const size = { ...state.size };

  storedData.translate = action.payload.translateStyle;
  storedData.percentageSize = calculatePercentageSize(
    action.payload.nodeRect,
    size.width,
    size.height,
  );

  const newSize = calculateElementSize(
    action.payload.nodeRect,
    { width: 1, height: 1 },
    [size.minWidth, size.minHeight],
  );
  size.width = newSize.width;
  size.height = newSize.height;

  return {
    ...state, storedData, size, fullscreen: true,
  };
};

export const turnOffFullscreen = (state: WindowWrapperState, action: TurnOffFullscreen) => {
  const percentageSize = { ...state.storedData.percentageSize };
  const size = { ...state.size };

  const newSize = calculateElementSize(
    action.payload.nodeRect,
    { width: percentageSize.width, height: percentageSize.height },
    [size.minWidth, size.minHeight],
  );

  size.width = newSize.width;
  size.height = newSize.height;

  return {
    ...state, size, fullscreen: false,
  };
};

export const setNodeSize = (state: WindowWrapperState, action: SetNodeSize) => {
  const refDim = {
    width: action.payload.nodeRect.element.size.width,
    height: action.payload.nodeRect.element.size.height,
  };

  return { ...state, size: { ...state.size, width: refDim.width, height: refDim.height } };
};

export const convertPercentageSize = (state: WindowWrapperState, action: ConvertPercentageSize) => {
  const newSize = calculateElementSize(
    action.payload.nodeRect,
    state.storedData.percentageSize,
    [state.size.minWidth, state.size.minHeight],
  );

  return {
    ...state,
    size: { ...state.size, ...newSize },
    screenSize: { ...action.payload.screenSize },
  };
};

export const setSize = (state: WindowWrapperState, action: SetSize) => {
  const newSize = {
    ...state.size,
    width: action.payload.width ? action.payload.width : state.size.width,
    height: action.payload.height ? action.payload.height : state.size.height,
    minWidth: action.payload.minWidth ? action.payload.minWidth : state.size.minWidth,
    minHeight: action.payload.minHeight ? action.payload.minHeight : state.size.minHeight,
  };
  return {
    ...state, size: { ...newSize },
  };
};

export const fixTranslate = (state: WindowWrapperState, action: FixTranslate) => {
  if (isOutOfAnyBounds(action.payload.nodeRect) && !state.animating) {
    return {
      ...state,
      storedData: {
        ...state.storedData,
        translate: adjustTranslateWithinBounds(action.payload.nodeRect, action.payload.translate),
      },
    };
  }
  return state;
};
