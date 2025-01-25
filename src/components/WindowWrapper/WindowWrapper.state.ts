import { Action, WindowWrapperActions, WindowWrapperState } from '@/components/WindowWrapper/WindowWrapper.state.type';

import {
  convertPercentageSize, setRelativeness,
  turnOnFullscreen,
} from '@/components/WindowWrapper/WindowWrapper.state.helpers';

export const initialState: WindowWrapperState = {
  size: {
    width: 0,
    height: 0,
  },
  relativeToParent: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
  translate: {
    x: 0,
    y: 0,
  },
  loading: true,
};

export function reducer(state: WindowWrapperState, action: Action) {
  switch (action.type) {
    case WindowWrapperActions.SWITCH_FULLSCREEN:
      if (action.payload.fullscreen) return turnOnFullscreen(state, action);
      return convertPercentageSize(state, action);
    case WindowWrapperActions.CONVERT_PERCENTAGE_SIZE:
      return convertPercentageSize(state, action);
    case WindowWrapperActions.SET_SIZE:
      return { ...state, size: { ...action.payload.size } };
    case WindowWrapperActions.SET_RELATIVENESS:
      return setRelativeness(state, action);
    case WindowWrapperActions.SET_TRANSLATE:
      return { ...state, translate: { ...action.payload.translate } };
    case WindowWrapperActions.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
