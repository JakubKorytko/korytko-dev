'use client';

import {
  cloneElement, useCallback,
  useEffect,
  useState,
} from 'react';
import { Rnd } from 'react-rnd';

import {
  AnimateAppProps, Animations,
} from '@/custom-hooks/useAnimations.type';

const waitForAnimationEnd = (node: HTMLElement | Rnd): Promise<void> => new Promise((resolve) => {
  const element = 'getSelfElement' in node ? node.getSelfElement() : node;
  if (!element) return;

  const handleAnimationEnd = () => {
    element.removeEventListener('animationend', handleAnimationEnd);
    element.removeEventListener('transitionend', handleAnimationEnd);
    resolve();
  };
  element.addEventListener('animationend', handleAnimationEnd);
  element.addEventListener('transitionend', handleAnimationEnd);
});

const AnimateApp: React.FC<AnimateAppProps> = ({
  animations,
  children,
  statusCallback,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState('');

  const handleAnimation = useCallback(
    async (type: keyof Animations) => {
      const animation = animations[type];
      if (!animation || !animation.status || !animation.animation) return;

      const refElement = children.props.ref?.current;
      if (!refElement) return;

      setCurrentAnimation(animation.animation);

      await waitForAnimationEnd(refElement);

      animation.callback?.();
      statusCallback?.(type, false);

      if (!animation.preserve) {
        setCurrentAnimation('');
      }
    },
    [animations, children, statusCallback],
  );

  useEffect(() => {
    Object.keys(animations).forEach((type) => {
      if (animations[type as keyof Animations]?.status) {
        handleAnimation(type as keyof Animations);
      }
    });
  }, [animations, handleAnimation]);

  return cloneElement(children, {
    className: `${children.props.className || ''} ${currentAnimation}`.trim(),
  });
};

export default AnimateApp;
