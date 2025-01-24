import { useCallback, useEffect, useReducer } from 'react';
import { Rnd } from 'react-rnd';

import {
  UseWindowWrapperEffectReturn,
  WindowWrapperActions,
  WindowWrapperEffectProps,
} from '@/components/WindowWrapper/WindowWrapper.state.type';

import {
  adjustTranslateWithinBounds,
  calculatePercentageSize,
  getNodeData,
  waitForAnimationsToFinish,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { initialState, reducer } from '@/components/WindowWrapper/WindowWrapper.state';

// todo: change or remove this
const getElement = (ref: Rnd | null) => {
  if (!ref) return null;
  return ref.getSelfElement();
};

const defaultMinConstraints = [50, 50];

// todo: change or remove this
const calculateCentered = (el: Rnd | null) => {
  if (!el) return { x: 0, y: 0 };
  const node = el.getSelfElement();
  if (!node) return { x: 0, y: 0 };
  const parent = node.parentElement;
  if (!parent) return { x: 0, y: 0 };

  const parentRect = parent.getBoundingClientRect();
  const childRect = node.getBoundingClientRect();

  const x = (parentRect.width - childRect.width) / 2;
  const y = (parentRect.height - childRect.height) / 2;

  return { x, y };
};

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
      const nodeData = getNodeData(target);

      if (handleResize) {
        handleResize({
          width: nodeData.element.size.width,
          height: nodeData.element.size.height,
        });
      }
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
        waitForAnimationsToFinish(target, () => updateSizeAndTranslate(target));
      });
    },
    [updateSizeAndTranslate],
  );

  useEffect(() => {
    const nodeRect = getNodeData(getElement(nodeRef.current));
    const { translate } = nodeRect.element;

    dispatch({
      type: WindowWrapperActions.SWITCH_FULLSCREEN,
      payload: { enabled: fullscreen ?? false, nodeRect, translate },
    });
  }, [fullscreen, nodeRef]);

  useEffect(() => {
    const node = getElement(nodeRef.current);
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
    if (centered) {
      dispatch({
        type: WindowWrapperActions.SET_SIZE,
        payload: {
          translate: calculateCentered(nodeRef.current),
        },
      });
    }
  }, [centered, nodeRef]);

  useEffect(() => {
    const nodeRect = getNodeData(getElement(nodeRef.current));
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
        payload: { nodeRect: getNodeData(getElement(nodeRef.current)) },
      });
    };

    window.addEventListener('resize', handleResizeEvent);
    return () => window.removeEventListener('resize', handleResizeEvent);
  }, [nodeRef]);

  useEffect(() => {
    const element = getElement(nodeRef.current);
    if (!state.loading && element) {
      waitForAnimationsToFinish(element, () => {
        const nodeRect = getNodeData(element);

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
