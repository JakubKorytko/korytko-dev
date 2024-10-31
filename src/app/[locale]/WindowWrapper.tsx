import './WindowWrapper.scss';
import React, { useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import {
  OnResize,
  Dimensions,
  WindowWrapperProps, NodeRefStyle,
} from '@/app/[locale]/WindowWrapper.type';
import {
  calculateElementSize,
  calculatePercentageSize,
  canResize,
  areDimensionsEqual,
} from '@/app/[locale]/WindowWrapper.helpers';

function WindowWrapper(props: WindowWrapperProps) {
  const [storedPercentageSize, setStoredPercentageSize] = React.useState<Dimensions>({
    width: 1,
    height: 1,
  });
  const [loading, setLoading] = React.useState(true);

  const nodeRef = React.useRef<HTMLDialogElement | null>(null);
  const {
    children, className = '',
    width, height, initialWidth, initialHeight, minConstraints = [15, 15],
    resizeCallback, handle: handler = '',
  } = props;

  const propagatePercentageCalculatedSize = () => {
    if (!nodeRef.current) return;
    const newElementSize = calculateElementSize(
      nodeRef.current,
      storedPercentageSize,
      minConstraints,
    );

    if (!areDimensionsEqual({ width, height }, newElementSize)) {
      resizeCallback(newElementSize);
    }
  };

  const propagateCurrentSize = () => {
    if (!nodeRef.current) return;

    const refDim = {
      width: nodeRef.current.clientWidth,
      height: nodeRef.current.clientHeight,
    };

    if (!areDimensionsEqual({ width, height }, refDim)) resizeCallback(refDim);
  };

  const updatePercentageSize = () => {
    if (!nodeRef.current) return;

    const newPercentageSize = calculatePercentageSize(
      nodeRef.current,
      nodeRef.current.clientWidth,
      nodeRef.current.clientHeight,
    );

    if (!areDimensionsEqual(storedPercentageSize, newPercentageSize)) {
      setStoredPercentageSize(newPercentageSize);
    }
  };

  const resizeListener = () => {
    window.addEventListener('resize', propagatePercentageCalculatedSize);
    return () => window.removeEventListener('resize', propagatePercentageCalculatedSize);
  };

  const onResize: OnResize = (event, { node, size, handle }) => {
    const dialog = node.parentElement;
    if (!dialog) return;

    if (canResize(handle, dialog, { width, height }, size)) {
      setStoredPercentageSize(calculatePercentageSize(dialog, size.width, size.height));
      resizeCallback({ width: size.width, height: size.height });
    }
  };

  const nodeRefStyle: NodeRefStyle = {
    width: width === 0 ? initialWidth : `${width}px`,
    height: height === 0 ? initialHeight : `${height}px`,
    visibility: loading ? 'hidden' : 'visible',
  };

  useEffect(resizeListener, [resizeListener, resizeCallback, storedPercentageSize, minConstraints]);
  useEffect(propagateCurrentSize, [width, height, resizeCallback]);
  useEffect(updatePercentageSize, [storedPercentageSize]);
  useEffect(() => { setLoading(false); }, []);

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle={handler}>
      <Resizable
        axis="both"
        resizeHandles={['n', 'w', 'e', 's']}
        height={height}
        minConstraints={minConstraints}
        width={width}
        onResize={onResize}
      >
        <dialog
          open
          ref={nodeRef}
          style={nodeRefStyle}
          className={className}
        >
          {children}
        </dialog>
      </Resizable>
    </Draggable>
  );
}

export default WindowWrapper;
