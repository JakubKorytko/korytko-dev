import { DraggableData } from 'react-draggable';
import { Dimensions, NodeAndParentData } from '@/components/WindowWrapper/WindowWrapper.type';

export enum WindowWrapperActions {
  TURN_ON_FULLSCREEN,
  TURN_OFF_FULLSCREEN,
  SET_NODE_SIZE,
  CONVERT_PERCENTAGE_SIZE,
  SET_DRAGGABLE_DATA,
  SET_SIZE,
  SET_STORED_PERCENTAGES,
  SET_TRANSLATE,
  SET_LOADING,
}

export type TurnOnFullscreen = {
  type: WindowWrapperActions.TURN_ON_FULLSCREEN;
  payload: {
    nodeRect: NodeAndParentData,
    translate: {
      x: number,
      y: number,
    }
  }
};
export type TurnOffFullscreen = {
  type: WindowWrapperActions.TURN_OFF_FULLSCREEN;
  payload: {
    nodeRect: NodeAndParentData,
    translate: {
      x: number,
      y: number
    }
  }
};
export type SetNodeSize = {
  type: WindowWrapperActions.SET_NODE_SIZE;
  payload: { nodeRect: NodeAndParentData }
};
export type ConvertPercentageSize = {
  type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE;
  payload: { nodeRect: NodeAndParentData }
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
export type SetStoredPercentages = {
  type: WindowWrapperActions.SET_STORED_PERCENTAGES;
  payload: Dimensions & { translateX: number, translateY: number };
};
export type SetTranslate = {
  type: WindowWrapperActions.SET_TRANSLATE;
  payload: {
    x: number,
    y: number,
  }
};
export type SetLoading = {
  type: WindowWrapperActions.SET_LOADING;
  payload: boolean
};
export type SetDraggableData = {
  type: WindowWrapperActions.SET_DRAGGABLE_DATA;
  payload: {
    draggableData: DraggableData,
    translatePercentageSize: { translateX: number, translateY: number } }
};

export interface WindowWrapperState {
  loading: boolean,
  size: {
    width: number,
    height: number,
    minWidth: number,
    minHeight: number,
  },
  storedData: {
    draggableData: DraggableData | undefined,
    percentageSize: {
      width: number,
      height: number,
      translateX: number,
      translateY: number,
    },
  },
  fullscreen: boolean,
}

export type Action =
    | TurnOnFullscreen
    | TurnOffFullscreen
    | SetNodeSize
    | SetSize
    | SetDraggableData
    | SetStoredPercentages
    | ConvertPercentageSize
    | SetTranslate
    | SetLoading;
