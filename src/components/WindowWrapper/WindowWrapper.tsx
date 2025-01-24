import React, { memo } from 'react';
import { DraggableEventHandler } from 'react-draggable';
import { Rnd, RndResizeCallback } from 'react-rnd';

import { WindowWrapperActions } from '@/components/WindowWrapper/WindowWrapper.state.type';
import { WindowWrapperProps } from '@/components/WindowWrapper/WindowWrapper.type';

import {
  calculatePercentageSize,
  canResize,
  getNodeData,
  nodeRefStyle,
} from '@/components/WindowWrapper/WindowWrapper.helpers';

import './WindowWrapper.scss';

import useWindowWrapperEffect from '@/custom-hooks/useWindowWrapperEffect';

function WindowWrapper(props: WindowWrapperProps) {
  const nodeRef = React.useRef<Rnd | null>(null);
  const {
    children, className,
    initialWidth, initialHeight,
    handle: handler,
    onResize: handleResize,
    fullscreen, minConstraints,
    centered,
    style,
    noAnimate,
  } = props;

  const [state, dispatch] = useWindowWrapperEffect({
    minConstraints, fullscreen, nodeRef, onResize: handleResize, centered,
  });

  const onResize: RndResizeCallback = (_, dir, refToElement, delta, __) => {
    const newSize = {
      width: delta.width + state.size.width,
      height: delta.height + state.size.height,
    };

    const dialog = refToElement;
    if (!dialog || state.fullscreen) return;

    const nodeRect = getNodeData(dialog);
    const { translate } = nodeRect.element;
    const {
      translate: translateLast,
      relativeToParent,
    } = calculatePercentageSize(nodeRect, translate, newSize.width, newSize.height);

    if (canResize(
      dir,
      nodeRect,
      { width: state.size.width, height: state.size.height },
      newSize,
      centered ?? false,
    )) {
      dispatch({
        type: WindowWrapperActions.SET_SIZE,
        payload: {
          size: newSize,
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

  const size = state.size.height !== 0 && state.size.width !== 0 ? state.size : undefined;
  const shouldAnimate = !state.loading && !noAnimate;
  const animation = shouldAnimate ? `animate-appear${centered ? '-centered' : ''}` : null;

  return (
    <Rnd
      className={`${className ?? ''} ${animation} relative`}
      bounds="parent"
      disableDragging={state.fullscreen}
      style={{
        ...nodeRefStyle(state),
        ...(style ?? {}),
      }}
      default={{
        x: 0,
        y: 0,
        width: initialWidth,
        height: initialHeight,
      }}
      dragHandleClassName={handler ?? ''}
      minWidth={state.size.min.width}
      minHeight={state.size.min.height}
      dragAxis="both"
      size={size}
      position={state.size.translate}
      onResizeStop={onResize}
      onDragStop={onDrag}
      ref={nodeRef}
    >
      {children}
    </Rnd>
  );
}

export default memo(WindowWrapper);
