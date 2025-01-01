import { useCallback, useEffect, useReducer } from 'react';
import {
  adjustTranslateWithinBounds,
  calculatePercentageSize,
  getNodeData,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import {
  WindowWrapperActions,
  UseWindowWrapperEffectReturn,
  WindowWrapperEffectProps,
} from '@/components/WindowWrapper/WindowWrapper.state.type';
import { initialState, reducer } from '@/components/WindowWrapper/WindowWrapper.state';

function useWindowWrapperEffect(props: WindowWrapperEffectProps): UseWindowWrapperEffectReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    minConstraints = [15, 15],
    fullscreen = false,
    onResize: handleResize = () => {},
    nodeRef,
  } = props;

  const updateSizeAndTranslate = useCallback(
    (target: HTMLElement) => {
      handleResize({ width: target.offsetWidth, height: target.offsetHeight });
      const nodeData = getNodeData(target);

      if (!state.fullscreen) {
        const { translate } = nodeData.element;
        const { x, y } = adjustTranslateWithinBounds(nodeData, translate);

        dispatch({
          type: WindowWrapperActions.SET_SIZE,
          payload: {
            translateLast: {
              lastX: translate.x / nodeData.parent.size.width,
              lastY: translate.y / nodeData.parent.size.height,
            },
            translate: { x, y },
          },
        });
      }
    },
    [handleResize, state.fullscreen],
  );

  const resizeObserverCallback: ResizeObserverCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        Promise.all(target.getAnimations().map((animation) => animation.finished)).then(() => {
          updateSizeAndTranslate(target);
        });
      });
    },
    [updateSizeAndTranslate],
  );

  useEffect(() => {
    const nodeRect = getNodeData(nodeRef.current);
    const { translate } = nodeRect.element;

    dispatch({
      type: WindowWrapperActions.SWITCH_FULLSCREEN,
      payload: { enabled: fullscreen, nodeRect, translate },
    });
  }, [fullscreen, nodeRef]);

  useEffect(() => {
    const node = nodeRef.current;
    const resizeObserver = new ResizeObserver(resizeObserverCallback);

    if (node) resizeObserver.observe(node);
    return () => {
      if (node) resizeObserver.unobserve(node);
    };
  }, [resizeObserverCallback, nodeRef]);

  useEffect(() => {
    dispatch({
      type: WindowWrapperActions.SET_SIZE,
      payload: {
        min: {
          width: minConstraints[0],
          height: minConstraints[1],
        },
      },
    });
  }, [minConstraints]);

  useEffect(() => {
    const nodeRect = getNodeData(nodeRef.current);
    const { translate } = nodeRect.element;

    const { translate: translateLast, relativeToParent } = calculatePercentageSize(
      nodeRect,
      translate,
      nodeRect.element.size.width,
      nodeRect.element.size.height,
    );

    dispatch({
      type: WindowWrapperActions.SET_SIZE,
      payload: {
        translateLast,
        relativeToParent,
      },
    });

    dispatch({
      type: WindowWrapperActions.SET_LOADING,
      payload: false,
    });

    const handleResizeEvent = () => {
      dispatch({
        type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE,
        payload: { nodeRect: getNodeData(nodeRef.current) },
      });
    };

    window.addEventListener('resize', handleResizeEvent);
    return () => window.removeEventListener('resize', handleResizeEvent);
  }, [nodeRef]);

  return [state, dispatch];
}

export default useWindowWrapperEffect;
