import './WindowWrapper.scss';
import React, {
  memo, useCallback, useEffect, useReducer,
} from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import {
  OnResize,
  WindowWrapperProps,
} from '@/components/WindowWrapper/WindowWrapper.type';
import {
  adjustTranslateWithinBounds,
  calculatePercentageSize,
  canResize, getNodeAndParentSize, getTranslateXY, isOutOfAnyBounds,
  nodeRefStyle,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { reducer, initialState } from './WindowWrapper.state';
import { WindowWrapperActions } from '@/components/WindowWrapper/WindowWrapper.state.type';

function WindowWrapper(props: WindowWrapperProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const nodeRef = React.useRef<HTMLDialogElement | null>(null);
  const [fullscreenSwitched, setFullScreenSwitched] = React.useState(false);

  const {
    children, className = '',
    initialWidth, initialHeight, minConstraints = [15, 15],
    handle: handler = '', fullscreen = false,
    onResize: handleResize,
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

  const onResize: OnResize = (event, { node, size, handle }) => {
    const dialog = node.parentElement;
    if (!dialog || state.fullscreen) return;

    const nodeRect = getNodeAndParentSize(dialog);

    if (canResize(handle, nodeRect, { width: state.size.width, height: state.size.height }, size)) {
      dispatch({
        type: WindowWrapperActions.SET_STORED_PERCENTAGES,
        payload: calculatePercentageSize(nodeRect, size.width, size.height),
      });
      dispatch({
        type: WindowWrapperActions.SET_SIZE,
        payload: { width: size.width, height: size.height, nodeRect },
      });
    }
  };

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
  }, [fullscreen, fullscreenSwitched]);

  useEffect(() => {
    setFullScreenSwitched(true);
  }, [fullscreen]);

  useEffect(() => {
    const node = nodeRef.current;
    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    if (node) resizeObserver.observe(node);
    return () => { if (node) resizeObserver.unobserve(node); };
  }, [resizeObserverCallback]);

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
  }, [minConstraints]);

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
  }, []);

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle={handler}>
      <Resizable
        axis="both"
        resizeHandles={['n', 'w', 'e', 's']}
        height={state.size.height}
        minConstraints={[state.size.minWidth, state.size.minHeight]}
        width={state.size.width}
        onResize={onResize}
      >
        <dialog
          open
          ref={nodeRef}
          style={nodeRefStyle(state, { width: initialWidth, height: initialHeight })}
          className={`${className} ${!state.loading ? 'animate-appear' : null}`}
        >
          {children}
        </dialog>
      </Resizable>
    </Draggable>
  );
}

export default memo(WindowWrapper);
