import {
  ConvertPercentageSize,
  SetNodeSize, SetSize,
  TurnOffFullscreen,
  TurnOnFullscreen,
  WindowWrapperState,
} from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  adjustTranslateWithinBounds,
  calculateElementSize,
  calculatePercentageSize,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { NodeAndParentData } from '@/components/WindowWrapper/WindowWrapper.type';

export const calculateTranslatePercentageSize = (
  nodeRect: NodeAndParentData,
  translate: { x: number, y: number },
) => ({
  translateX: translate.x / nodeRect.parent.size.width,
  translateY: translate.y / nodeRect.parent.size.height,
});

export const convertTranslatePercentageSize = (
  nodeRect: NodeAndParentData,
  percentageSize: { translateX: number, translateY: number },
) => {
  const parentSize = nodeRect.parent.size;

  const calculatedSize = {
    x: parentSize.width * percentageSize.translateX,
    y: parentSize.height * percentageSize.translateY,
  };

  return adjustTranslateWithinBounds(nodeRect, calculatedSize);
};

export const turnOnFullscreen = (state: WindowWrapperState, action: TurnOnFullscreen) => {
  const storedData = { ...state.storedData };
  const size = { ...state.size };

  storedData.percentageSize = calculatePercentageSize(
    action.payload.nodeRect,
    action.payload.translate,
    size.width,
    size.height,
  );

  if (storedData.draggableData) {
    storedData.draggableData.x = 0;
    storedData.draggableData.y = 0;
  }

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
  const storedData = { ...state.storedData };

  const newSize = calculateElementSize(
    action.payload.nodeRect,
    { width: percentageSize.width, height: percentageSize.height },
    [size.minWidth, size.minHeight],
  );

  const newNodeRect = { ...action.payload.nodeRect };
  newNodeRect.element.size.width = newSize.width;
  newNodeRect.element.size.height = newSize.height;

  const translateSize = convertTranslatePercentageSize(newNodeRect, percentageSize);

  if (storedData.draggableData) {
    storedData.draggableData.x = translateSize.x;
    storedData.draggableData.y = translateSize.y;
  }

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

  const storedData = { ...state.storedData };

  const newNodeRect = { ...action.payload.nodeRect };
  newNodeRect.element.size.width = newSize.width;
  newNodeRect.element.size.height = newSize.height;

  const translateSize = convertTranslatePercentageSize(newNodeRect, storedData.percentageSize);

  if (storedData.draggableData && !state.fullscreen) {
    storedData.draggableData.x = translateSize.x;
    storedData.draggableData.y = translateSize.y;
  }

  return {
    ...state,
    size: { ...state.size, ...newSize },
    storedData: { ...storedData },
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
