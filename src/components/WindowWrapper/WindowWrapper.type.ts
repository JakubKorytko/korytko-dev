import React, { SyntheticEvent } from 'react';
import { ResizeCallbackData, ResizeHandle } from 'react-resizable';

export type Dimensions = { width: number; height: number };
export type Position = { x: number; y: number };
export type LastPosition = { lastX: number; lastY: number };

export interface WindowWrapperProps {
  onResize?: (size: Dimensions) => void;
  children: React.ReactNode,
  initialWidth: string,
  initialHeight: string,
  className?: string,
  minConstraints?: [number, number],
  fullscreen?: boolean,
  handle?: string,
  centered?: boolean,
  style?: React.CSSProperties,
  noAnimate?: boolean,
}

interface TranslateData extends Position, LastPosition {}

export interface NodeData {
  size: Dimensions,
  translate: TranslateData
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  }
}

export interface NodeAndParentData {
  element: NodeData,
  parent: Omit<NodeData, 'translate'>
}

export type Direction = 'x' | 'y' | 'e' | 'n' | 'w' | 's';

export type CenteredHandle = { [Key in keyof Omit<Bounds, 'x' | 'y'>]: Direction };

export type Bounds = {
  [key in Direction]: boolean;
};

export type IsOutOfBounds = (nodeRect: NodeAndParentData, direction: Direction) => boolean;

export type CanResize = (
  handle: ResizeHandle,
  nodeRect: NodeAndParentData,
  size: Dimensions,
  newSize: Dimensions,
  centered: boolean
) => boolean;

export type CalculateElementSize = (
  nodeRect: NodeAndParentData,
  percentageSize: Dimensions,
  limits: [number, number],
) => Dimensions;

export type OnResize = (event: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => void;

export type CalculatePercentageSize = (
  nodeRect: NodeAndParentData,
  translate: Position,
  newWidth: number,
  newHeight: number,
) => {
  relativeToParent: Dimensions,
  translate: LastPosition,
};

export type NodeRefStyle = { [Key in keyof Dimensions]: string } & {
  visibility: 'hidden' | undefined,
  borderRadius: string | undefined,
  margin: number,
};

export type GetNodeData = (element: HTMLElement | null) => NodeAndParentData;

export type AdjustTranslateWithinBounds = (
  nodeRect: NodeAndParentData,
  translate: Position,
  centered: boolean,
) => Position;
