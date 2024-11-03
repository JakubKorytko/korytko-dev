import { Action, WindowWrapperActions, WindowWrapperState } from '@/app/[locale]/WindowWrapper.state.type';
import {
  convertPercentageSize,
  fixTranslate,
  setNodeSize,
  setSize,
  turnOffFullscreen,
  turnOnFullscreen,
} from '@/app/[locale]/WindowWrapper.state.helpers';

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

export function reducer(state: WindowWrapperState, action: Action) {
  switch (action.type) {
    case WindowWrapperActions.TURN_ON_FULLSCREEN:
      return turnOnFullscreen(state, action);
    case WindowWrapperActions.TURN_OFF_FULLSCREEN:
      return turnOffFullscreen(state, action);
    case WindowWrapperActions.SET_NODE_SIZE:
      return setNodeSize(state, action);
    case WindowWrapperActions.CONVERT_PERCENTAGE_SIZE:
      return convertPercentageSize(state, action);
    case WindowWrapperActions.SET_SIZE:
      return setSize(state, action);
    case WindowWrapperActions.FIX_TRANSLATE:
      return fixTranslate(state, action);
    case WindowWrapperActions.SET_STORED_PERCENTAGES:
      if (state.fullscreen) return state;
      return { ...state, storedData: { ...state.storedData, percentageSize: action.payload } };
    case WindowWrapperActions.SET_TRANSLATE:
      return { ...state, storedTranslate: action.payload };
    case WindowWrapperActions.SET_LOADING:
      return { ...state, loading: action.payload };
    case WindowWrapperActions.SET_ANIMATING:
      return { ...state, animating: action.payload };
    default:
      return state;
  }
}
