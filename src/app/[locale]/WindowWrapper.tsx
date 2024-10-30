import React, { SyntheticEvent, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import styles from '@/app/[locale]/ConsoleComponent.module.scss';

function WindowWrapper(props: {
  children: React.ReactNode,
  width: number,
  height: number,
  resizeCallback: ({ height, width }: { height: number, width: number }) => void,
}) {
  const nodeRef = React.useRef(null as null | HTMLDialogElement);
  const {
    children, width, height, resizeCallback,
  } = props;

  const isInBorders = (element: HTMLDialogElement, direction: 'x' | 'y') => {
    if (!element.parentElement) return [true, true];
    const parentData = element.parentElement.getBoundingClientRect();
    const elementData = element.getBoundingClientRect();

    const x = elementData.x + elementData.width >= parentData.width + parentData.x;
    const y = elementData.y + elementData.height >= parentData.height + parentData.y;

    const leftB = elementData.left <= parentData.left;
    const topB = elementData.top <= parentData.top;
    const rightB = elementData.right >= parentData.right;
    const bottomB = elementData.bottom >= parentData.bottom;

    const horizontal = x || leftB || rightB;
    const vertical = y || topB || bottomB;

    if (direction === 'x') return horizontal;
    return vertical;
  };

  useEffect(() => {
    const localHeight = nodeRef.current ? nodeRef.current.clientHeight : 0;
    const localWidth = nodeRef.current ? nodeRef.current.clientWidth : 0;
    resizeCallback({ width: localWidth, height: localHeight });
  }, []);

  const onResize = (event: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
    if (!nodeRef.current) return;
    if (['e', 'w'].includes(handle) && size.width > width) {
      if (isInBorders(nodeRef.current, 'x')) {
        return;
      }
    }

    if (['s', 'n'].includes(handle) && size.height > height) {
      if (isInBorders(nodeRef.current, 'y')) {
        return;
      }
    }

    resizeCallback({ width: size.width, height: size.height });
  };

  const nodeRefWidth = width === 0 ? '90%' : `${width}px`;
  const nodeRefHeight = height === 0 ? '95%' : `${height}px`;

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle={`.${styles['console-header-handler']}`}>
      <Resizable
        axis="both"
        resizeHandles={['n', 'w', 'e', 's']}
        height={height}
        minConstraints={[385, 85]}
        width={width}
        onResize={onResize}
      >
        <dialog
          open
          ref={nodeRef}
          style={{ width: nodeRefWidth, height: nodeRefHeight }}
          className={`${styles['console-component']} flex flex-col`}
        >
          {children}
        </dialog>
      </Resizable>
    </Draggable>
  );
}

export default WindowWrapper;
