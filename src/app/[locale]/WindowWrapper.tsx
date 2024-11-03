import './WindowWrapper.scss';
import React, { useEffect, useReducer } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import {
  OnResize,
  WindowWrapperProps,
} from '@/app/[locale]/WindowWrapper.type';
import {
  calculatePercentageSize,
  canResize, getNodeAndParentSize, getTranslateXY,
  nodeRefStyle,
} from '@/app/[locale]/WindowWrapper.helpers';
import { reducer, initialState } from './WindowWrapper.state';
import { WindowWrapperActions } from '@/app/[locale]/WindowWrapper.state.type';

function WindowWrapper(props: WindowWrapperProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const nodeRef = React.useRef<HTMLDialogElement | null>(null);

  const {
    children, className = '',
    initialWidth, initialHeight, minConstraints = [15, 15],
    handle: handler = '', fullscreen = false,
  } = props;

  const resizeListener = () => {
    const convertPercentages = () => {
      if (!nodeRef.current) return;
      const nodeRect = getNodeAndParentSize(nodeRef.current);
      dispatch({
        type: WindowWrapperActions.CONVERT_PERCENTAGE_SIZE,
        payload: { nodeRect, screenSize: { width: window.innerWidth, height: window.innerHeight } },
      });
    };
    window.addEventListener('resize', convertPercentages);

    return () => window.removeEventListener('resize', convertPercentages);
  };

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
    if (!nodeRef.current) return;
    const nodeRect = getNodeAndParentSize(nodeRef.current);
    const translateStyle = nodeRef.current.style.transform;

    if (fullscreen && !state.fullscreen) {
      dispatch({
        type: WindowWrapperActions.TURN_ON_FULLSCREEN,
        payload: { nodeRect, translateStyle },
      });
    } else if (!fullscreen && state.fullscreen) {
      dispatch({
        type: WindowWrapperActions.TURN_OFF_FULLSCREEN,
        payload: { nodeRect },
      });
      nodeRef.current.style.transform = state.storedData.translate;
    }
  }, [fullscreen, state.fullscreen, state.storedData.translate]);

  useEffect(() => {
    if (!nodeRef.current || state.fullscreen) return;
    const nodeRect = getNodeAndParentSize(nodeRef.current);
    const translate = getTranslateXY(nodeRef.current);
    dispatch({
      type: WindowWrapperActions.FIX_TRANSLATE,
      payload: { nodeRect, translate },
    });
  }, [state.fullscreen, state.screenSize.width, state.screenSize.height]);

  useEffect(() => {
    if (!nodeRef.current) return;
    if (!state.fullscreen) {
      nodeRef.current.style.transform = state.storedData.translate;
    } else if (state.fullscreen) {
      nodeRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [state.fullscreen, state.storedData.translate]);

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

  useEffect(resizeListener, []);

  useEffect(() => {
    dispatch({
      type: WindowWrapperActions.SET_LOADING,
      payload: false,
    });

    if (!nodeRef.current) return;
    nodeRef.current.addEventListener('animationstart', () => {
      dispatch({
        type: WindowWrapperActions.SET_ANIMATING,
        payload: true,
      });
    }, false);
    nodeRef.current.addEventListener('animationend', () => {
      dispatch({
        type: WindowWrapperActions.SET_ANIMATING,
        payload: false,
      });
    }, false);
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

export default WindowWrapper;
