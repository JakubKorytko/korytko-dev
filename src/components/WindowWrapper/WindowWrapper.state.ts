import { Action, WindowWrapperActions, WindowWrapperState } from '@/components/WindowWrapper/WindowWrapper.state.type';
import {
  convertPercentageSize,
  setSize,
  turnOffFullscreen,
  turnOnFullscreen,
} from '@/components/WindowWrapper/WindowWrapper.state.helpers';

export const initialState: WindowWrapperState = {
  size: {
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
  },
  storedData: {
    draggableData: undefined,
    percentageSize: {
      width: 0,
      height: 0,
      translateX: 0,
      translateY: 0,
    },
  },
  fullscreen: false,
  loading: true,
};

export function reducer(state: WindowWrapperState, action: Action) {
  switch (action.type) {
    case WindowWrapperActions.SWITCH_FULLSCREEN:
      if (action.payload.enabled) return turnOnFullscreen(state, action);
      return turnOffFullscreen(state, action);
    case WindowWrapperActions.CONVERT_PERCENTAGE_SIZE:
      return convertPercentageSize(state, action);
    case WindowWrapperActions.SET_SIZE:
      return setSize(state, action);
    case WindowWrapperActions.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
