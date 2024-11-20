import { Dimensions, NodeAndParentData } from '@/components/WindowWrapper/WindowWrapper.type';

export enum WindowWrapperActions {
  TURN_ON_FULLSCREEN,
  TURN_OFF_FULLSCREEN,
  SET_NODE_SIZE,
  CONVERT_PERCENTAGE_SIZE,
  SET_SIZE,
  FIX_TRANSLATE,
  SET_ANIMATING,
  SET_STORED_PERCENTAGES,
  SET_TRANSLATE,
  SET_LOADING,
}

export type TurnOnFullscreen = {
  type: WindowWrapperActions.TURN_ON_FULLSCREEN;
  payload: { nodeRect: NodeAndParentData,
    translateStyle: string
  }
};
export type TurnOffFullscreen = {
  type: WindowWrapperActions.TURN_OFF_FULLSCREEN;
  payload: { nodeRect: NodeAndParentData }
};
export type SetNodeSize = {
  type: WindowWrapperActions.SET_NODE_SIZE;
  payload: { nodeRect: NodeAndParentData }
};
export type ConvertPercentageSize = {
  type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE;
  payload: { nodeRect: NodeAndParentData,
    screenSize: { width: number, height: number }
  }
};
export type SetSize = {
  type: WindowWrapperActions.SET_SIZE;
  payload: { nodeRect: NodeAndParentData,
    width?: number,
    height?: number,
    minWidth?: number,
    minHeight?: number
  }
};
export type FixTranslate = {
  type: WindowWrapperActions.FIX_TRANSLATE,
  payload: { nodeRect: NodeAndParentData,
    translate: { x: number, y: number }
  }
};
export type SetAnimating = {
  type: WindowWrapperActions.SET_ANIMATING,
  payload: boolean
};
export type SetStoredPercentages = {
  type: WindowWrapperActions.SET_STORED_PERCENTAGES;
  payload: Dimensions
};
export type SetTranslate = {
  type: WindowWrapperActions.SET_TRANSLATE;
  payload: string
};
export type SetLoading = {
  type: WindowWrapperActions.SET_LOADING;
  payload: boolean
};

export interface WindowWrapperState {
  screenSize: {
    width: number,
    height: number
  },
  loading: boolean,
  animating: boolean,
  size: {
    width: number,
    height: number,
    minWidth: number,
    minHeight: number,
  },
  storedData: {
    translate: string,
    percentageSize: {
      width: number,
      height: number,
    },
  },
  fullscreen: boolean,
}

export type Action =
    | TurnOnFullscreen
    | TurnOffFullscreen
    | SetNodeSize
    | SetSize
    | FixTranslate
    | SetAnimating
    | SetStoredPercentages
    | ConvertPercentageSize
    | SetTranslate
    | SetLoading;
