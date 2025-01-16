import { Action, WindowWrapperActions, WindowWrapperState } from '@/components/WindowWrapper/WindowWrapper.state.type';

import {
  convertPercentageSize,
  setSize,
  turnOnFullscreen,
} from '@/components/WindowWrapper/WindowWrapper.state.helpers';

export const initialState: WindowWrapperState = {
  size: {
    width: 0,
    height: 0,
    min: {
      width: 0,
      height: 0,
    },
    relativeToParent: {
      width: 0,
      height: 0,
    },
    translate: {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
    },
  },
  fullscreen: false,
  loading: true,
  centered: false,
};

export function reducer(state: WindowWrapperState, action: Action) {
  switch (action.type) {
    case WindowWrapperActions.SWITCH_FULLSCREEN:
      if (action.payload.enabled) return turnOnFullscreen(state, action);
      return convertPercentageSize(state, action, false);
    case WindowWrapperActions.CONVERT_PERCENTAGE_SIZE:
      return convertPercentageSize(state, action);
    case WindowWrapperActions.SET_CENTERED:
      return { ...state, centered: action.payload };
    case WindowWrapperActions.SET_SIZE:
      return setSize(state, action);
    case WindowWrapperActions.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
