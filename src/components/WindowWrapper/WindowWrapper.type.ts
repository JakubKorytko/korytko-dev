import React from 'react';

export type Dimensions = { width: number; height: number };
export type Position = { x: number; y: number };

export interface WindowWrapperProps {
  onResize?: (size: Dimensions) => void;
  children: React.ReactNode,
  initialWidth: string,
  initialHeight: string,
  className?: string,
  minConstraints?: Dimensions,
  fullscreen?: boolean,
  handle?: string,
  centered?: boolean,
  style?: React.CSSProperties,
  noAnimate?: boolean,
}

interface TranslateData extends Position { relative: Position }

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

export type CalculateElementSize = (
  nodeRect: NodeAndParentData,
  percentageSize: Dimensions,
  limits: [number, number],
) => Dimensions;

export type CalculatePercentageSize = (
  nodeRect: NodeAndParentData,
  translate: Position,
  newSize: Dimensions
) => {
  relativeToParent: Dimensions & Position;
};

export type GetNodeData = (element: HTMLElement | null) => NodeAndParentData;

export type AdjustTranslateWithinBounds = (
  nodeRect: NodeAndParentData,
  translate: Position,
) => Position;
