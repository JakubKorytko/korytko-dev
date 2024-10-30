import './WindowWrapper.scss';
import React, { SyntheticEvent, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface WindowWrapperProps {
  children: React.ReactNode,
  width: number,
  height: number,
  initialWidth: string,
  initialHeight: string,
  resizeCallback: ({ height, width }: { height: number, width: number }) => void,
  className?: string,
  minConstraints?: [number, number],
  handle?: string
}

function WindowWrapper(props: WindowWrapperProps) {
  const [storedPercentageSize, setStoredPercentageSize] = React.useState<
  { width: number, height: number }>({
    width: 1,
    height: 1,
  });
  const nodeRef = React.useRef<HTMLDialogElement | null>(null);
  const {
    children, className = '',
    width, height, initialWidth, initialHeight, minConstraints = [15, 15],
    resizeCallback, handle: handler = '',
  } = props;

  const isOutOfBounds = (element: HTMLDialogElement, direction: 'x' | 'y') => {
    const parent = element.parentElement?.getBoundingClientRect();
    const elem = element.getBoundingClientRect();

    if (!parent) return [true, true];

    const bounds = {
      x: elem.left <= parent.left || elem.right >= parent.right,
      y: elem.top <= parent.top || elem.bottom >= parent.bottom,
    };

    return direction === 'x' ? bounds.x : bounds.y;
  };

  const calculatePercentageSize = (
    element: HTMLDialogElement,
    newWidth: number,
    newHeight: number,
  ) => {
    const parent = element.parentElement?.getBoundingClientRect();

    if (!parent) return { width: 1, height: 1 };

    return {
      width: newWidth / parent.width,
      height: newHeight / parent.height,
    };
  };

  useEffect(() => {
    if (nodeRef.current) {
      resizeCallback({
        width: nodeRef.current.clientWidth,
        height: nodeRef.current.clientHeight,
      });
    }
  }, [resizeCallback]);

  useEffect(() => {
    const calculateElementSize = (element: HTMLDialogElement) => {
      const parent = element.parentElement?.getBoundingClientRect();

      if (!parent) return { width: 0, height: 0 };

      return {
        width: Math.max(storedPercentageSize.width * parent.width, minConstraints[0]),
        height: Math.max(storedPercentageSize.height * parent.height, minConstraints[1]),
      };
    };

    const listener = () => {
      if (!nodeRef.current) return;

      resizeCallback(calculateElementSize(nodeRef.current));
    };

    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [minConstraints, resizeCallback, storedPercentageSize.height, storedPercentageSize.width]);

  useEffect(() => {
    if (nodeRef.current) {
      setStoredPercentageSize(
        calculatePercentageSize(
          nodeRef.current,
          nodeRef.current.clientWidth,
          nodeRef.current.clientHeight,
        ),
      );
    }
  }, []);

  const onResize = (event: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
    if (!nodeRef.current) return;

    const isWidthHandle = ['e', 'w'].includes(handle);
    const isHeightHandle = ['s', 'n'].includes(handle);

    if (isWidthHandle && size.width > width && isOutOfBounds(nodeRef.current, 'x')) return;

    if (isHeightHandle && size.height > height && isOutOfBounds(nodeRef.current, 'y')) return;

    setStoredPercentageSize(calculatePercentageSize(nodeRef.current, size.width, size.height));
    resizeCallback({ width: size.width, height: size.height });
  };

  const nodeRefStyle = {
    width: width === 0 ? initialWidth : `${width}px`,
    height: height === 0 ? initialHeight : `${height}px`,
  };

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
