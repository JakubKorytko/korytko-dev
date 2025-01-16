import { useCallback, useEffect, useReducer } from 'react';

import {
  UseWindowWrapperEffectReturn,
  WindowWrapperActions,
  WindowWrapperEffectProps,
} from '@/components/WindowWrapper/WindowWrapper.state.type';

import {
  adjustTranslateWithinBounds,
  calculatePercentageSize,
  getNodeData, waitForAnimationsToFinish,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { initialState, reducer } from '@/components/WindowWrapper/WindowWrapper.state';

const defaultMinConstraints = [50, 50];

function useWindowWrapperEffect(props: WindowWrapperEffectProps): UseWindowWrapperEffectReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    minConstraints,
    fullscreen,
    onResize: handleResize,
    nodeRef,
    centered,
  } = props;

  const updateSizeAndTranslate = useCallback(
    (target: HTMLElement) => {
      if (handleResize) handleResize({ width: target.offsetWidth, height: target.offsetHeight });
      const nodeData = getNodeData(target);

      if (!state.fullscreen) {
        const { translate } = nodeData.element;
        const { x, y } = adjustTranslateWithinBounds(nodeData, translate, state.centered);

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
    [handleResize, state.fullscreen, state.centered],
  );

  const resizeObserverCallback: ResizeObserverCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        waitForAnimationsToFinish(target, () => updateSizeAndTranslate(target));
      });
    },
    [updateSizeAndTranslate],
  );

  useEffect(() => {
    const nodeRect = getNodeData(nodeRef.current);
    const { translate } = nodeRect.element;

    dispatch({
      type: WindowWrapperActions.SWITCH_FULLSCREEN,
      payload: { enabled: fullscreen ?? false, nodeRect, translate },
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
          width: (minConstraints ?? defaultMinConstraints)[0],
          height: (minConstraints ?? defaultMinConstraints)[1],
        },
      },
    });
  }, [minConstraints]);

  useEffect(() => {
    dispatch({
      type: WindowWrapperActions.SET_CENTERED,
      payload: centered ?? false,
    });
  }, [centered]);

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

  useEffect(() => {
    if (!state.loading && nodeRef.current) {
      waitForAnimationsToFinish(nodeRef.current, () => {
        const nodeRect = getNodeData(nodeRef.current);

        dispatch({
          type: WindowWrapperActions.SET_SIZE,
          payload: {
            size: {
              width: nodeRect.element.size.width,
              height: nodeRect.element.size.height,
            },
          },
        });
      });
    }
  }, [nodeRef, state.loading]);

  return [state, dispatch];
}

export default useWindowWrapperEffect;
