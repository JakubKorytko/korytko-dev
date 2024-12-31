import React, { SyntheticEvent } from 'react';
import { ResizeCallbackData, ResizeHandle } from 'react-resizable';

export type Dimensions = { width: number; height: number };

export interface WindowWrapperProps {
  onResize: (size: Dimensions) => void;
  children: React.ReactNode,
  initialWidth: string,
  initialHeight: string,
  resizeCallback: ({ height, width }: Dimensions) => void,
  className?: string,
  minConstraints?: [number, number],
  fullscreen?: boolean,
  handle?: string
}

export interface NodeData {
  size: {
    width: number;
    height: number;
  },
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  }
}

export interface NodeAndParentData {
  element: NodeData,
  parent: NodeData
}

export type IsOutOfBounds = (nodeRect: NodeAndParentData, direction: 'x' | 'y') => boolean;

export type CanResize = (
  handle: ResizeHandle,
  nodeRect: NodeAndParentData,
  size: Dimensions,
  newSize: Dimensions,
) => boolean;

export type CalculateElementSize = (
  nodeRect: NodeAndParentData,
  percentageSize: Dimensions,
  limits: [number, number],
) => Dimensions;

export type OnResize = (event: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => void;

export type CalculatePercentageSize = (
  nodeRect: NodeAndParentData,
  translate: { x: number, y: number },
  newWidth: number,
  newHeight: number,
) => Dimensions & { translateX: number, translateY: number };

export type NodeRefStyle = {
  width: string,
  height: string,
  visibility: 'hidden' | 'visible',
  borderRadius: string | undefined
};
