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
    fullscreen, onResize: handleResize, ref: nodeRef, centered, min, isWindowAnimated,
  } = props;
  const lastFullscreen = useRef(fullscreen);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (lastFullscreen.current === fullscreen) return;
    lastFullscreen.current = fullscreen;
    const nodeRect = getNodeData(getElement(nodeRef));
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
          nodeRect: getNodeData(getElement(nodeRef)),
          min,
        },
      });
    };
    window.addEventListener('resize', handleResizeEvent);
    return () => window.removeEventListener('resize', handleResizeEvent);
  }, [fullscreen, nodeRef, min]);

  useEffect(() => {
    const node = getElement(nodeRef);
    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    if (node) resizeObserver.observe(node);
    return () => { if (node) resizeObserver.unobserve(node); };
  }, [resizeObserverCallback, nodeRef]);

  useLayoutEffect(() => {
    if (centered && !isWindowAnimated) {
      if (!firstRender.current) return;
      firstRender.current = false;
      const { x, y } = calculateCentered(nodeRef);

      dispatch({
        type: WindowWrapperActions.SET_TRANSLATE,
        payload: {
          translate: { x, y },
        },
      });

      const nodeData = getNodeData(getElement(nodeRef));
      dispatch({
        type: WindowWrapperActions.SET_RELATIVENESS,
        payload: {
          translate: {
            x: x / nodeData.parent.size.width,
            y: y / nodeData.parent.size.height,
          },
        },
      });
    }
  }, [centered, nodeRef, isWindowAnimated]);

  useEffect(() => {
    const nodeRect = getNodeData(getElement(nodeRef));
    const { relativeToParent } = calculatePercentageSize(
      nodeRect,
      nodeRect.element.translate,
      nodeRect.element.size,
    );

    const {
      x, y, width, height,
    } = relativeToParent;

    dispatch({
      type: WindowWrapperActions.SET_RELATIVENESS,
      payload: {
        size: { width, height }, translate: { x, y },
      },
    });
    dispatch({ type: WindowWrapperActions.SET_LOADING, payload: false });
  }, [nodeRef]);

  useEffect(() => {
    const element = getElement(nodeRef);
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
