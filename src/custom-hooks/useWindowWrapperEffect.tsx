import React, { useCallback, useEffect, useReducer } from 'react';
import { DraggableData } from 'react-draggable';
import {
  adjustTranslateWithinBounds,
  calculatePercentageSize,
  getNodeAndParentSize, getTranslateXY,
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
        if (!fullscreenSwitched && !fullscreen && state.storedData.draggableData) {
          const rect = getNodeAndParentSize(target);
          const translate = getTranslateXY(target);
          const { x, y } = adjustTranslateWithinBounds(rect, translate);
          const translatePercentageSize = {
            translateX: translate.x / rect.parent.size.width,
            translateY: translate.y / rect.parent.size.height,
          };
          const draggableData: DraggableData = { ...state.storedData.draggableData, x, y };
          dispatch({
            type: WindowWrapperActions.SET_SIZE,
            payload: {
              nodeRect: rect,
              translatePercentageSize,
              draggableData,
            },
          });
        }
      });
    });
  }, [handleResize, fullscreenSwitched,
    fullscreen,
    state.storedData.draggableData]);

  useEffect(() => {
    if (nodeRef.current) {
      const nodeRect = getNodeAndParentSize(nodeRef.current);
      const translate = getTranslateXY(nodeRef.current);

      if (fullscreenSwitched) {
        dispatch({
          type: WindowWrapperActions.SWITCH_FULLSCREEN,
          payload: { enabled: fullscreen, nodeRect, translate },
        });
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
      const translate = getTranslateXY(nodeRef.current);

      const newPercentageSize = calculatePercentageSize(
        nodeRect,
        translate,
        nodeRef.current.clientWidth,
        nodeRef.current.clientHeight,
      );

      dispatch({
        type: WindowWrapperActions.SET_SIZE,
        payload: {
          nodeRect,
          percentageSize: newPercentageSize,
        },
      });
    }

    return () => window.removeEventListener('resize', convertPercentages);
  }, [nodeRef]);

  return [state, dispatch];
}

export default useWindowWrapperEffect;
