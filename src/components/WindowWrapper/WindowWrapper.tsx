import React, { memo } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Resizable } from 'react-resizable';

import { WindowWrapperActions } from '@/components/WindowWrapper/WindowWrapper.state.type';
import { OnResize, WindowWrapperProps } from '@/components/WindowWrapper/WindowWrapper.type';

import {
  calculatePercentageSize,
  canResize,
  getNodeData,
  nodeRefStyle,
} from '@/components/WindowWrapper/WindowWrapper.helpers';

import './WindowWrapper.scss';

import useWindowWrapperEffect from '@/custom-hooks/useWindowWrapperEffect';

function WindowWrapper(props: WindowWrapperProps) {
  const nodeRef = React.useRef<HTMLDialogElement | null>(null);
  const {
    children, className = '',
    initialWidth, initialHeight,
    handle: handler = '',
    onResize: handleResize,
    fullscreen, minConstraints,
  } = props;

  const [state, dispatch] = useWindowWrapperEffect({
    minConstraints, fullscreen, nodeRef, onResize: handleResize,
  });

  const onResize: OnResize = (_, { node, size, handle }) => {
    const dialog = node.parentElement;
    if (!dialog || state.fullscreen) return;

    const nodeRect = getNodeData(dialog);
    const { translate } = nodeRect.element;
    const {
      translate: translateLast,
      relativeToParent,
    } = calculatePercentageSize(nodeRect, translate, size.width, size.height);

    if (canResize(handle, nodeRect, { width: state.size.width, height: state.size.height }, size)) {
      dispatch({
        type: WindowWrapperActions.SET_SIZE,
        payload: {
          size,
          translateLast,
          relativeToParent,
        },
      });
    }
  };

  const onDrag: DraggableEventHandler = (_, draggableData) => {
    const nodeRect = getNodeData(draggableData.node);
    const { x, y } = draggableData;

    dispatch({
      type: WindowWrapperActions.SET_SIZE,
      payload: {
        translateLast: nodeRect.element.translate,
        translate: { x, y },
      },
    });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      handle={handler}
      onStop={onDrag}
      disabled={state.fullscreen}
      position={state.size.translate}
    >
      <Resizable
        axis="both"
        resizeHandles={['n', 'w', 'e', 's']}
        width={state.size.width}
        height={state.size.height}
        minConstraints={[state.size.min.width, state.size.min.height]}
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
