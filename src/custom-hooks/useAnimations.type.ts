import { ReactElement } from 'react';
import { Rnd } from 'react-rnd';

export type Animation = {
  status?: boolean;
  animation: string;
  callback?: VoidFunction;
  preserve?: boolean;
  runCallbackBeforeAnimation?: boolean,
  convertTranslate?: boolean
};

export type Animations = {
  open: Animation;
  close: Animation;
  maximize: Animation;
  minimize: Animation;
  maximizeRestore: Animation;
  minimizeRestore: Animation;
};

export type UseAnimationReturn = {
  animations: Animations;
  setStatus: (type: keyof Animations, status: boolean) => void;
  setAnimation: (type: keyof Animations, animation: string) => void;
  setCallback: (type: keyof Animations, callback: VoidFunction) => void;
};

export type UseAnimationProps = {
  defaultAnimations?: Partial<Animations>;
};

export type AnimateAppChildren = ReactElement<{
  ref: React.RefObject<Rnd | HTMLElement | null>,
  className?: string
}>;

export type AnimateAppProps = {
  animations: Partial<Animations>;
  children: AnimateAppChildren;
  statusCallback?: (type: keyof Animations, status: boolean) => void;
};
