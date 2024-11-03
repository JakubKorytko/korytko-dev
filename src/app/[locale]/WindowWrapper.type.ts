import React, { SyntheticEvent } from 'react';
import { ResizeCallbackData, ResizeHandle } from 'react-resizable';

export type Dimensions = { width: number; height: number };

export interface WindowWrapperProps {
  children: React.ReactNode,
  width: number,
  height: number,
  initialWidth: string,
  initialHeight: string,
  resizeCallback: ({ height, width }: Dimensions) => void,
  className?: string,
  minConstraints?: [number, number],
  fullscreen?: boolean,
  handle?: string
}

export interface WindowWrapperState {
  loading: boolean,
  size: {
    width: number,
    height: number,
    minWidth: number,
    minHeight: number,
  },
  storedData: {
    translate: string,
    percentageSize: {
      width: number,
      height: number,
    },
  },
  fullscreen: boolean,
}

export type IsOutOfBounds = (element: HTMLElement, direction: 'x' | 'y') => boolean;

export type CanResize = (
  handle: ResizeHandle,
  element: HTMLElement,
  size: Dimensions,
  newSize: Dimensions,
) => boolean;

export type CalculateElementSize = (
  element: HTMLElement,
  percentageSize: Dimensions,
  limits: [number, number],
) => Dimensions;

export type OnResize = (event: SyntheticEvent, { node, size, handle }: ResizeCallbackData) => void;

export type CalculatePercentageSize = (
  element: HTMLElement,
  newWidth: number,
  newHeight: number,
) => Dimensions;

export type NodeRefStyle = {
  width: string,
  height: string,
  visibility: 'hidden' | 'visible',
  borderRadius: string | undefined
};
