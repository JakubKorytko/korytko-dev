import React from 'react';

import {
  Dimensions, LastPosition,
  NodeAndParentData,
  NodeRefStyle, Position,
  WindowWrapperProps,
} from '@/components/WindowWrapper/WindowWrapper.type';

export enum WindowWrapperActions {
  SWITCH_FULLSCREEN,
  CONVERT_PERCENTAGE_SIZE,
  SET_SIZE,
  SET_LOADING,
  SET_CENTERED,
}

export type SwitchFullscreen = {
  type: WindowWrapperActions.SWITCH_FULLSCREEN;
  payload: {
    enabled: boolean;
    nodeRect: NodeAndParentData,
    translate: Position
  }
};
export type ConvertPercentageSize = {
  type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE;
  payload: { nodeRect: NodeAndParentData }
};
export type SetSize = {
  type: WindowWrapperActions.SET_SIZE;
  payload: {
    size?: Dimensions,
    min?: Dimensions,
    relativeToParent?: Dimensions,
    translate?: Position,
    translateLast?: LastPosition
  }
};
export type SetLoading = {
  type: WindowWrapperActions.SET_LOADING;
  payload: boolean
};

export type SetCentered = {
  type: WindowWrapperActions.SET_CENTERED;
  payload: boolean
};

export type Action =
    | SwitchFullscreen
    | SetSize
    | ConvertPercentageSize
    | SetLoading
    | SetCentered;

export interface WindowWrapperState {
  size: Dimensions & {
    min: Dimensions,
    relativeToParent: Dimensions,
    translate: Position & LastPosition
  },
  fullscreen: boolean,
  loading: boolean,
  centered: boolean
}

export type WindowWrapperEffectProps = Partial<WindowWrapperProps> & {
  nodeRef: React.MutableRefObject<HTMLDialogElement | null>;
};

export type UseWindowWrapperEffectReturn = [WindowWrapperState, React.Dispatch<Action>];

export type ITurnOnFullscreen = (
  state: WindowWrapperState,
  action: SwitchFullscreen,
) => WindowWrapperState;

export type IConvertTranslatePercentageSize = (
  nodeRect: NodeAndParentData,
  size: WindowWrapperState['size'],
  newSize: Dimensions,
  centered: boolean
) => Position;

export type IConvertPercentageSize = (
  state: WindowWrapperState,
  action: ConvertPercentageSize | SwitchFullscreen,
  fullscreen?: boolean
) => WindowWrapperState;

export type ISetSize = (state: WindowWrapperState, action: SetSize) => WindowWrapperState;

export type INodeRefStyle = (
  state: WindowWrapperState,
  initialSize: { [Key in keyof Dimensions]: string },
) => NodeRefStyle;
