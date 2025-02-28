import { useCallback, useState } from 'react';

import { Animations, UseAnimationProps, UseAnimationReturn } from '@/custom-hooks/useAnimations.type';

const createDefaultAnimationObject = () => ({
  status: false,
  animation: '',
  callback: undefined,
  runCallbackBeforeAnimation: false,
  convertTranslate: false,
});

const animationKeys: (keyof Animations)[] = ['open', 'close', 'maximize', 'minimize', 'maximizeRestore', 'minimizeRestore'];

const defaultState: Animations = Object.fromEntries(
  animationKeys.map(
    (state) => [state, createDefaultAnimationObject()],
  ),
) as Animations;

const useAnimation = ({ defaultAnimations }: UseAnimationProps = {}): UseAnimationReturn => {
  const [animations, setAnimations] = useState<Animations>({
    ...defaultState, ...defaultAnimations,
  });

  const setStatus = useCallback(
    (type: keyof Animations, status: boolean) => {
      setAnimations((prev) => ({
        ...prev,
        [type]: { ...prev[type], status },
      }));
    },
    [],
  );

  const setAnimation = useCallback(
    (type: keyof Animations, animation: string) => {
      setAnimations((prev) => ({
        ...prev,
        [type]: { ...prev[type], animation },
      }));
    },
    [],
  );

  const setCallback = useCallback(
    (type: keyof Animations, callback: VoidFunction) => {
      setAnimations((prev) => ({
        ...prev,
        [type]: { ...prev[type], callback },
      }));
    },
    [],
  );

  return {
    animations,
    setStatus,
    setAnimation,
    setCallback,
  };
};

export default useAnimation;
