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
  canResize,
  nodeRefStyle,
} from '@/app/[locale]/WindowWrapper.helpers';
import { reducer, initialState } from './WindowWrapper.state';

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
      dispatch({
        type: 'CONVERT_PERCENTAGE_SIZE',
        payload: { node: nodeRef.current },
      });
      dispatch({
        type: 'FIX_TRANSLATE',
        payload: { node: nodeRef.current },
      });
    };
    window.addEventListener('resize', convertPercentages);

    return () => window.removeEventListener('resize', convertPercentages);
  };

  const onResize: OnResize = (event, { node, size, handle }) => {
    const dialog = node.parentElement;
    if (!dialog || state.fullscreen) return;

    if (canResize(handle, dialog, { width: state.size.width, height: state.size.height }, size)) {
      dispatch({
        type: 'SET_STORED_PERCENTAGES',
        payload: calculatePercentageSize(dialog, size.width, size.height),
      });
      dispatch({
        type: 'SET_SIZE',
        payload: { width: size.width, height: size.height, node: nodeRef.current },
      });
    }
  };

  useEffect(() => {
    if (!nodeRef.current) return;
    if (fullscreen && !state.fullscreen) {
      dispatch({
        type: 'TURN_ON_FULLSCREEN',
        payload: { node: nodeRef.current },
      });
    } else if (!fullscreen && state.fullscreen) {
      dispatch({
        type: 'TURN_OFF_FULLSCREEN',
        payload: { node: nodeRef.current },
      });
      nodeRef.current.style.transform = state.storedData.translate;
    }
  }, [fullscreen, state.fullscreen, state.storedData.translate]);

  useEffect(() => {
    if (!nodeRef.current) return;
    dispatch({
      type: 'SET_SIZE',
      payload: {
        node: nodeRef.current,
        minWidth: minConstraints[0],
        minHeight: minConstraints[1],
      },
    });
  }, [minConstraints]);

  useEffect(() => {
    resizeListener();
    dispatch({
      type: 'SET_LOADING',
      payload: false,
    });

    if (!nodeRef.current) return;
    const newPercentageSize = calculatePercentageSize(
      nodeRef.current,
      nodeRef.current.clientWidth,
      nodeRef.current.clientHeight,
    );
    dispatch({
      type: 'SET_STORED_PERCENTAGES',
      payload: newPercentageSize,
    });
    dispatch({
      type: 'SET_NODE_SIZE',
      payload: { node: nodeRef.current },
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
