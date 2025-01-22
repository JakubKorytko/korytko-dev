import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import WindowWrapper from '@/components/WindowWrapper/WindowWrapper';

import { getRect } from '@/utils/dom';

import styles from './WindowWrapper.cy.module.scss';

const parentClassName = `p${uuidv4()}`;
const elementClassName = `e${uuidv4()}`;

function runTests<T>(
  testCases: T[],
  testFn: (testCase: T, isCentered: boolean) => void,
) {
  testCases.forEach((testCase) => {
    [false, true].forEach((isCentered) => {
      testFn(testCase, isCentered);
    });
  });
}

function WindowWrapperDummy({ centered }: { centered?: boolean }) {
  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => setFullscreen((prev) => !prev);

  return (
    <div className={`${parentClassName} ${centered ? styles.center : ''} ${styles.parent}`}>
      <button className={styles.toggle} type="button" onClick={toggleFullscreen} data-cy="toggle-fullscreen">
        Toggle Fullscreen
      </button>
      <WindowWrapper
        initialHeight="250px"
        initialWidth="250px"
        className={elementClassName}
        handle={`.${elementClassName}-handler`}
        centered={centered}
        noAnimate
        fullscreen={isFullscreen}
        style={{ position: 'relative' }}
      >
        <div className={`${elementClassName}-handler ${styles.handler}`} />
      </WindowWrapper>
    </div>

  );
}

const dragTestCases = [
  { description: 'bottom right corner', deltaX: 1000, deltaY: 1000 },
  { description: 'top left corner', deltaX: -1000, deltaY: -1000 },
  { description: 'top right corner', deltaX: 1000, deltaY: -1000 },
  { description: 'bottom left corner', deltaX: -1000, deltaY: 1000 },
];

const resizeTestCases = [
  {
    description: 'bottom', deltaX: 0, deltaY: 5000, handler: 's',
  },
  {
    description: 'top', deltaX: 0, deltaY: -5000, handler: 'n',
  },
  {
    description: 'right', deltaX: 5000, deltaY: 0, handler: 'e',
  },
  {
    description: 'left', deltaX: -5000, deltaY: 0, handler: 'w',
  },
];

const dragDelta = { deltaX: 150, deltaY: 100 };

describe('WindowWrapper', () => {
  runTests(dragTestCases, ({ description, deltaX, deltaY }, isCentered) => {
    it(`cannot be dragged outside parent - ${description} (centered: ${isCentered})`, () => {
      cy.viewport(600, 600);
      cy.mount(<WindowWrapperDummy centered={isCentered} />);
      cy.get(`.${elementClassName}-handler`).move({ deltaX, deltaY });
      cy.isInParentBounds({ parent: `.${parentClassName}`, element: `.${elementClassName}` });
    });
  });

  runTests(resizeTestCases, ({
    description, deltaX, deltaY, handler,
  }, isCentered) => {
    it(`cannot be resized outside parent - ${description} (centered: ${isCentered})`, () => {
      cy.viewport(600, 600);
      cy.mount(<WindowWrapperDummy centered={isCentered} />);
      cy.resize(`.react-resizable-handle-${handler}`, { x: deltaX, y: deltaY });
      cy.isInParentBounds({ parent: `.${parentClassName}`, element: `.${elementClassName}` });
    });
  });

  runTests([{}], (_, isCentered) => {
    it(`maintains original position after toggling fullscreen on and off (centered: ${isCentered})`, () => {
      cy.viewport(600, 600);
      cy.mount(<WindowWrapperDummy centered={isCentered} />);
      cy.get(`.${elementClassName}-handler`)
        .move(dragDelta)
        .then(() => cy.get(`.${elementClassName}`).then((element) => cy.wrap(getRect(element[0]))))
        .then((initialPosition) => {
          cy.get('[data-cy="toggle-fullscreen"]').click({ force: true });
          cy.get('[data-cy="toggle-fullscreen"]').click({ force: true });

          cy.get(`.${elementClassName}`).then((element) => {
            const finalPosition = getRect(element[0]);
            expect(finalPosition.top).to.eq(initialPosition.top);
            expect(finalPosition.left).to.eq(initialPosition.left);
          });
        });
    });
  });
});
