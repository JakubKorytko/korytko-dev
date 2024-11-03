import { Dimensions, NodeAndParentData, WindowWrapperState } from '@/app/[locale]/WindowWrapper.type';
import {
  adjustTranslateWithinBounds,
  calculateElementSize,
  calculatePercentageSize,
  isOutOfAnyBounds,
} from '@/app/[locale]/WindowWrapper.helpers';

type TurnOnFullScreen = { type: 'TURN_ON_FULLSCREEN'; payload: { nodeRect: NodeAndParentData, translateStyle: string } };
type TurnOffFullscreen = { type: 'TURN_OFF_FULLSCREEN'; payload: { nodeRect: NodeAndParentData } };
type SetNodeSize = { type: 'SET_NODE_SIZE'; payload: { nodeRect: NodeAndParentData } };
type ConvertPercentageSize = { type: 'CONVERT_PERCENTAGE_SIZE'; payload: { nodeRect: NodeAndParentData, screenSize: { width: number, height: number } } };
type SetSize = { type: 'SET_SIZE'; payload: { nodeRect: NodeAndParentData, width?: number, height?: number, minWidth?: number, minHeight?: number } };
type FixTranslate = { type: 'FIX_TRANSLATE', payload: { nodeRect: NodeAndParentData, translate: { x: number, y: number } } };
type SetAnimating = { type: 'SET_ANIMATING', payload: boolean };

type Action =
    | TurnOnFullScreen
    | TurnOffFullscreen
    | SetNodeSize
    | SetSize
    | FixTranslate
    | SetAnimating
    | { type: 'SET_STORED_PERCENTAGES'; payload: Dimensions }
    | ConvertPercentageSize
    | { type: 'SET_TRANSLATE'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean };

export const initialState: WindowWrapperState = {
  screenSize: {
    width: 0,
    height: 0,
  },
  loading: true,
  animating: false,
  size: {
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
  },
  storedData: {
    translate: '',
    percentageSize: {
      width: 0,
      height: 0,
    },
  },
  fullscreen: false,
};

const turnOnFullscreen = (state: WindowWrapperState, action: TurnOnFullScreen) => {
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

const turnOffFullscreen = (state: WindowWrapperState, action: TurnOffFullscreen) => {
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

const setNodeSize = (state: WindowWrapperState, action: SetNodeSize) => {
  const refDim = {
    width: action.payload.nodeRect.element.size.width,
    height: action.payload.nodeRect.element.size.height,
  };

  return { ...state, size: { ...state.size, width: refDim.width, height: refDim.height } };
};

const convertPercentageSize = (state: WindowWrapperState, action: ConvertPercentageSize) => {
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

const setSize = (state: WindowWrapperState, action: SetSize) => {
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

const fixTranslate = (state: WindowWrapperState, action: FixTranslate) => {
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

// Reducer function to handle state updates
export function reducer(state: WindowWrapperState, action: Action) {
  switch (action.type) {
    case 'TURN_ON_FULLSCREEN':
      return turnOnFullscreen(state, action);
    case 'TURN_OFF_FULLSCREEN':
      return turnOffFullscreen(state, action);
    case 'SET_NODE_SIZE':
      return setNodeSize(state, action);
    case 'SET_STORED_PERCENTAGES':
      if (state.fullscreen) return state;
      return { ...state, storedData: { ...state.storedData, percentageSize: action.payload } };
    case 'CONVERT_PERCENTAGE_SIZE':
      return convertPercentageSize(state, action);
    case 'SET_SIZE':
      return setSize(state, action);
    case 'FIX_TRANSLATE':
      return fixTranslate(state, action);
    case 'SET_TRANSLATE':
      return { ...state, storedTranslate: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ANIMATING':
      return { ...state, animating: action.payload };
    default:
      return state;
  }
}
