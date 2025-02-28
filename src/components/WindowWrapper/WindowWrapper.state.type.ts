import React from 'react';
import { Rnd } from 'react-rnd';

import {
  Dimensions,
  NodeAndParentData,
  Position,
  WindowWrapperProps,
} from '@/components/WindowWrapper/WindowWrapper.type';

export enum WindowWrapperActions {
  SWITCH_FULLSCREEN,
  CONVERT_PERCENTAGE_SIZE,
  SET_SIZE,
  SET_RELATIVENESS,
  SET_TRANSLATE,
  SET_LOADING,
}

export type SwitchFullscreen = {
  type: WindowWrapperActions.SWITCH_FULLSCREEN;
  payload: {
    nodeRect: NodeAndParentData,
    translate: Position,
    fullscreen: boolean,
    min?: Dimensions
  }
};
export type ConvertPercentageSize = {
  type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE;
  payload: { nodeRect: NodeAndParentData, fullscreen: boolean, min?: Dimensions }
};
export type SetSize = {
  type: WindowWrapperActions.SET_SIZE;
  payload: {
    size: Dimensions,
  }
};

export type SetTranslate = {
  type: WindowWrapperActions.SET_TRANSLATE;
  payload: {
    translate: Position,
  }
};

export type SetRelativeness = {
  type: WindowWrapperActions.SET_RELATIVENESS;
  payload: {
    size?: Dimensions,
    translate?: Position
  }
};

export type SetLoading = {
  type: WindowWrapperActions.SET_LOADING;
  payload: boolean
};

export type Action =
    | SwitchFullscreen
    | SetSize
    | ConvertPercentageSize
    | SetLoading
    | SetRelativeness
    | SetTranslate;

export interface WindowWrapperState {
  size: Dimensions,
  relativeToParent: Dimensions & Position,
  translate: Position,
  loading: boolean,
}

export type WindowWrapperEffectProps = Partial<WindowWrapperProps> & {
  ref: React.RefObject<Rnd | null>;
  min?: Dimensions
};

export type UseWindowWrapperEffectReturn = [WindowWrapperState, React.Dispatch<Action>];

export type ITurnOnFullscreen = (
  state: WindowWrapperState,
  action: SwitchFullscreen,
) => WindowWrapperState;

export type IConvertTranslatePercentageSize = (
  nodeRect: NodeAndParentData,
  relTranslate: Position,
  newSize: Dimensions,
) => Position;

export type IConvertPercentageSize = (
  state: WindowWrapperState,
  action: ConvertPercentageSize | SwitchFullscreen,
) => WindowWrapperState;

export type ISetRelativeness = (
  state: WindowWrapperState, action: SetRelativeness) => WindowWrapperState;
