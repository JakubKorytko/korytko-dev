import { Rnd } from 'react-rnd';

export const getHTMLElement = (node: Rnd | HTMLElement | null) => {
  if (!node) return null;
  return 'getSelfElement' in node ? node.getSelfElement() : node;
};

const getTranslateValues = (element: HTMLElement) => {
  const { transform } = element.style;
  const match = transform.match(/translate\(([^)]+)\)/);
  if (!match) return null;

  const values = match[1].split(',').map((v) => v.trim());
  return { x: values[0], y: values[1] || '0px' };
};

const convertTranslateToAbsoluteValues = (node: Rnd | HTMLElement | null) => {
  const element = getHTMLElement(node);
  if (!element) return { left: '0px', top: '0px' };
  const { x: left, y: top } = getTranslateValues(element) ?? { x: '0px', y: '0px' };
  return { left, top };
};

export const setLeftAndTop = (node: Rnd | HTMLElement | null) => {
  const element = getHTMLElement(node);
  if (!element) return false;
  const style = convertTranslateToAbsoluteValues(element);
  element.style.setProperty('left', style.left);
  element.style.setProperty('top', style.top);
  element.style.removeProperty('transform');
  return true;
};

export const unsetLeftAndTop = (node: Rnd | HTMLElement | null, translate: string) => {
  const element = getHTMLElement(node);
  if (!element) return false;
  element.style.setProperty('left', '0px');
  element.style.setProperty('top', '0px');
  element.style.setProperty('transform', translate);
  return true;
};

export const waitForAnimationEnd = (node: HTMLElement | Rnd): Promise<void> => new Promise(
  (resolve) => {
    const element = getHTMLElement(node);
    if (!element) return;
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      element.removeEventListener('transitionend', handleAnimationEnd);

      resolve();
    };
    element.addEventListener('animationend', handleAnimationEnd);
    element.addEventListener('transitionend', handleAnimationEnd);
  },
);
