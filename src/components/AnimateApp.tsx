'use client';

import {
  cloneElement, useCallback, useEffect, useState,
} from 'react';

import { AnimateAppProps, Animations } from '@/custom-hooks/useAnimations.type';

import {
  getHTMLElement, setLeftAndTop, unsetLeftAndTop, waitForAnimationEnd,
} from '@/components/AnimateApp.helpers';

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
      if (!refElement) {
        setCurrentAnimation('');
        return;
      }

      const htmlElement = getHTMLElement(refElement);
      const translate = htmlElement ? htmlElement.style.transform : '';

      setCurrentAnimation(animation.animation);

      if (animation.convertTranslate) setLeftAndTop(htmlElement);
      if (!animation.runCallbackBeforeAnimation) await waitForAnimationEnd(refElement);

      animation.callback?.();
      statusCallback?.(type, false);

      if (animation.runCallbackBeforeAnimation) await waitForAnimationEnd(refElement);
      if (animation.convertTranslate) unsetLeftAndTop(htmlElement, translate);

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
