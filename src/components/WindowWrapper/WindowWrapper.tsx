import './WindowWrapper.scss';
import React, { memo } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Resizable } from 'react-resizable';
import { OnResize, WindowWrapperProps } from '@/components/WindowWrapper/WindowWrapper.type';
import {
  calculatePercentageSize,
  canResize,
  getNodeAndParentSize,
  nodeRefStyle,
} from '@/components/WindowWrapper/WindowWrapper.helpers';
import { WindowWrapperActions } from '@/components/WindowWrapper/WindowWrapper.state.type';
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

  const onDrag: DraggableEventHandler = (_, draggableData) => {
    dispatch({
      type: WindowWrapperActions.SET_DRAGGABLE_DATA,
      payload: draggableData,
    });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      handle={handler}
      onDrag={onDrag}
      position={{
        x: state.storedData.draggableData?.x || 0,
        y: state.storedData.draggableData?.y || 0,
      }}
    >
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
