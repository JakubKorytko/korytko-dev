import {
  useCallback, useEffect, useLayoutEffect, useReducer, useRef,
} from 'react';

import {
  UseWindowWrapperEffectReturn,
  WindowWrapperActions,
  WindowWrapperEffectProps,
} from '@/components/WindowWrapper/WindowWrapper.state.type';

import {
  adjustTranslateWithinBounds, calculateCentered,
  calculatePercentageSize, getElement,
  getNodeData,
  waitForAnimationsToFinish,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { initialState, reducer } from '@/components/WindowWrapper/WindowWrapper.state';

function useWindowWrapperEffect(props: WindowWrapperEffectProps): UseWindowWrapperEffectReturn {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    fullscreen, onResize: handleResize, nodeRef, centered, min,
  } = props;
  const lastFullscreen = useRef(fullscreen);

  useLayoutEffect(() => {
    if (lastFullscreen.current === fullscreen) return;
    lastFullscreen.current = fullscreen;
    const nodeRect = getNodeData(getElement(nodeRef.current));
    dispatch({
      type: WindowWrapperActions.SWITCH_FULLSCREEN,
      payload: {
        fullscreen: fullscreen ?? false, nodeRect, translate: nodeRect.element.translate, min,
      },
    });
  }, [fullscreen, nodeRef, min]);

  const updateSizeAndTranslate = useCallback(
    (target: HTMLElement) => {
      const nodeData = getNodeData(target);
      if (handleResize) {
        handleResize({ width: nodeData.element.size.width, height: nodeData.element.size.height });
      }
      if (fullscreen === false) {
        const { translate } = nodeData.element;
        dispatch({
          type: WindowWrapperActions.SET_RELATIVENESS,
          payload: {
            translate: {
              x: translate.x / nodeData.parent.size.width,
              y: translate.y / nodeData.parent.size.height,
            },
          },
        });
        dispatch({
          type: WindowWrapperActions.SET_TRANSLATE,
          payload: { translate: adjustTranslateWithinBounds(nodeData, translate) },
        });
      }
    },
    [handleResize, fullscreen],
  );

  const resizeObserverCallback = useCallback((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => waitForAnimationsToFinish(
      entry.target as HTMLElement,
      () => updateSizeAndTranslate(entry.target as HTMLElement),
    ));
  }, [updateSizeAndTranslate]);

  useEffect(() => {
    const handleResizeEvent = () => {
      dispatch({
        type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE,
        payload: {
          fullscreen: fullscreen ?? false,
          nodeRect: getNodeData(getElement(nodeRef.current)),
        },
      });
    };
    window.addEventListener('resize', handleResizeEvent);
    return () => window.removeEventListener('resize', handleResizeEvent);
  }, [fullscreen, nodeRef]);

  useEffect(() => {
    const node = getElement(nodeRef.current);
    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    if (node) resizeObserver.observe(node);
    return () => { if (node) resizeObserver.unobserve(node); };
  }, [resizeObserverCallback, nodeRef]);

  useEffect(() => {
    if (centered) {
      dispatch({
        type: WindowWrapperActions.SET_TRANSLATE,
        payload: {
          translate: calculateCentered(nodeRef.current),
        },
      });
    }
  }, [centered, nodeRef]);

  useEffect(() => {
    const nodeRect = getNodeData(getElement(nodeRef.current));
    const { relativeToParent } = calculatePercentageSize(
      nodeRect,
      nodeRect.element.translate,
      nodeRect.element.size,
    );
    dispatch({
      type: WindowWrapperActions.SET_RELATIVENESS,
      payload: {
        size: relativeToParent, translate: relativeToParent,
      },
    });
    dispatch({ type: WindowWrapperActions.SET_LOADING, payload: false });
  }, [nodeRef]);

  useEffect(() => {
    const element = getElement(nodeRef.current);
    if (!state.loading && element) {
      waitForAnimationsToFinish(element, () => {
        const nodeRect = getNodeData(element);
        dispatch({ type: WindowWrapperActions.SET_SIZE, payload: { size: nodeRect.element.size } });
      });
    }
  }, [nodeRef, state.loading]);

  return [state, dispatch];
}

export default useWindowWrapperEffect;
