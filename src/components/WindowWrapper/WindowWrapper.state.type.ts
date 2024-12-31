import { DraggableData } from 'react-draggable';
import { Dimensions, NodeAndParentData } from '@/components/WindowWrapper/WindowWrapper.type';

export enum WindowWrapperActions {
  SWITCH_FULLSCREEN,
  CONVERT_PERCENTAGE_SIZE,
  SET_SIZE,
  SET_LOADING,
}

export type SwitchFullscreen = {
  type: WindowWrapperActions.SWITCH_FULLSCREEN;
  payload: {
    enabled: boolean;
    nodeRect: NodeAndParentData,
    translate: {
      x: number,
      y: number,
    }
  }
};
export type ConvertPercentageSize = {
  type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE;
  payload: { nodeRect: NodeAndParentData }
};
export type SetSize = {
  type: WindowWrapperActions.SET_SIZE;
  payload: {
    nodeRect: NodeAndParentData,
    width?: number,
    height?: number,
    minWidth?: number,
    minHeight?: number
    percentageSize?: Dimensions & { translateX: number, translateY: number },
    draggableData?: DraggableData,
    translatePercentageSize?: { translateX: number, translateY: number }
  }
};
export type SetLoading = {
  type: WindowWrapperActions.SET_LOADING;
  payload: boolean
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
    | SwitchFullscreen
    | SetSize
    | ConvertPercentageSize
    | SetLoading;
