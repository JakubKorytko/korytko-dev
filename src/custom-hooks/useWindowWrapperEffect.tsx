import React, { useCallback, useEffect, useReducer } from 'react';
import {
  adjustTranslateWithinBounds,
  calculatePercentageSize,
  getNodeAndParentSize, getTranslateXY,
  isOutOfAnyBounds,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { Action, WindowWrapperActions, WindowWrapperState } from '@/components/WindowWrapper/WindowWrapper.state.type';
import { initialState, reducer } from '@/components/WindowWrapper/WindowWrapper.state';
import { WindowWrapperProps } from '@/components/WindowWrapper/WindowWrapper.type';

type WindowWrapperEffectProps = Partial<WindowWrapperProps> &
{ nodeRef: React.MutableRefObject<HTMLDialogElement | null> };

function useWindowWrapperEffect(props:
WindowWrapperEffectProps): [WindowWrapperState, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fullscreenSwitched, setFullScreenSwitched] = React.useState(false);

  const {
    minConstraints = [15, 15],
    fullscreen = false,
    onResize: handleResize = () => {},
    nodeRef,
  } = props;

  const resizeObserverCallback: ResizeObserverCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;
      Promise.all(target.getAnimations().map((animation) => animation.finished)).then(() => {
        handleResize({ width: target.offsetWidth, height: target.offsetHeight });
        if (fullscreenSwitched) {
          if (fullscreen) target.style.transform = 'translate(0px, 0px)';
          else target.style.transform = state.storedData.translate;
          setFullScreenSwitched(false);
        } else {
          const rect = getNodeAndParentSize(target);
          if (isOutOfAnyBounds(rect)) {
            const translate = getTranslateXY(target);
            target.style.transform = adjustTranslateWithinBounds(rect, translate);
          }
        }
      });
    });
  }, [handleResize, fullscreen, fullscreenSwitched, state.storedData.translate]);

  useEffect(() => {
    if (nodeRef.current) {
      const nodeRect = getNodeAndParentSize(nodeRef.current);
      const translateStyle = nodeRef.current.style.transform;

      if (fullscreenSwitched) {
        if (fullscreen) {
          dispatch({
            type: WindowWrapperActions.TURN_ON_FULLSCREEN,
            payload: { nodeRect, translateStyle },
          });
        } else if (!fullscreen) {
          dispatch({
            type: WindowWrapperActions.TURN_OFF_FULLSCREEN,
            payload: { nodeRect },
          });
        }
      }
    }
  }, [fullscreen, fullscreenSwitched, nodeRef]);

  useEffect(() => {
    setFullScreenSwitched(true);
  }, [fullscreen]);

  useEffect(() => {
    const node = nodeRef.current;
    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    if (node) resizeObserver.observe(node);
    return () => { if (node) resizeObserver.unobserve(node); };
  }, [resizeObserverCallback, nodeRef]);

  useEffect(() => {
    if (!nodeRef.current) return;
    const nodeRect = getNodeAndParentSize(nodeRef.current);
    dispatch({
      type: WindowWrapperActions.SET_SIZE,
      payload: {
        nodeRect,
        minWidth: minConstraints[0],
        minHeight: minConstraints[1],
      },
    });
  }, [minConstraints, nodeRef]);

  useEffect(() => {
    const convertPercentages = () => {
      if (!nodeRef.current) return;
      const nodeRect = getNodeAndParentSize(nodeRef.current);
      dispatch({
        type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE,
        payload: { nodeRect },
      });
    };
    window.addEventListener('resize', convertPercentages);

    dispatch({
      type: WindowWrapperActions.SET_LOADING,
      payload: false,
    });

    if (nodeRef.current) {
      const nodeRect = getNodeAndParentSize(nodeRef.current);
      const newPercentageSize = calculatePercentageSize(
        nodeRect,
        nodeRef.current.clientWidth,
        nodeRef.current.clientHeight,
      );
      dispatch({
        type: WindowWrapperActions.SET_STORED_PERCENTAGES,
        payload: newPercentageSize,
      });
      dispatch({
        type: WindowWrapperActions.SET_NODE_SIZE,
        payload: { nodeRect },
      });
    }

    return () => window.removeEventListener('resize', convertPercentages);
  }, [nodeRef]);

  return [state, dispatch];
}

export default useWindowWrapperEffect;
