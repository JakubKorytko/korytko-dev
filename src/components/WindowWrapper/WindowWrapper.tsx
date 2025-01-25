import React, { memo } from 'react';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';

import { WindowWrapperActions } from '@/components/WindowWrapper/WindowWrapper.state.type';
import { WindowWrapperProps } from '@/components/WindowWrapper/WindowWrapper.type';

import {
  calculatePercentageSize,
  getNodeData,
  resizeHandleClasses,
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
    minConstraints, fullscreen, nodeRef, onResize: handleResize, centered, min: minConstraints,
  });

  const onResize: RndResizeCallback = (_, __, refToElement, delta, position) => {
    const newSize = {
      width: delta.width + state.size.width,
      height: delta.height + state.size.height,
    };

    const dialog = refToElement;
    if (!dialog || fullscreen) return;

    const nodeRect = getNodeData(dialog);
    const {
      relativeToParent,
    } = calculatePercentageSize(nodeRect, position, newSize);

    dispatch({
      type: WindowWrapperActions.SET_SIZE,
      payload: {
        size: newSize,
      },
    });
    dispatch({
      type: WindowWrapperActions.SET_RELATIVENESS,
      payload: {
        translate: relativeToParent,
        size: relativeToParent,
      },
    });
  };

  const onDrag: RndDragCallback = (_, draggableData) => {
    const nodeRect = getNodeData(draggableData.node);
    const { x, y } = draggableData;

    dispatch({
      type: WindowWrapperActions.SET_RELATIVENESS,
      payload: {
        translate: nodeRect.element.translate.relative,
      },
    });
    dispatch({
      type: WindowWrapperActions.SET_TRANSLATE,
      payload: {
        translate: { x, y },
      },
    });
  };

  const size = state.size.height !== 0 && state.size.width !== 0 ? state.size : undefined;
  const shouldAnimate = !state.loading && !noAnimate;
  const animation = shouldAnimate ? `animate-appear${centered ? '-centered' : ''}` : null;

  const rndDefault = {
    x: 0,
    y: 0,
    width: initialWidth,
    height: initialHeight,
  };

  const rndStyle: Partial<{
    visibility: 'hidden' | 'visible';
    borderRadius: string,
    margin: number
  }> = {
    ...(style ?? {}),
    visibility: state.loading ? 'hidden' : undefined,
    borderRadius: fullscreen ? '0' : undefined,
    margin: 0,
  };

  return (
    <Rnd
      className={`${className ?? ''} ${animation} relative`}
      bounds="parent"
      disableDragging={fullscreen}
      style={rndStyle}
      default={rndDefault}
      resizeHandleClasses={resizeHandleClasses}
      dragHandleClassName={handler ?? ''}
      minWidth={minConstraints?.width ?? 50}
      minHeight={minConstraints?.height ?? 50}
      dragAxis="both"
      size={size}
      position={state.translate}
      onResizeStop={onResize}
      onDragStop={onDrag}
      ref={nodeRef}
    >
      {children}
    </Rnd>
  );
}

export default memo(WindowWrapper);
