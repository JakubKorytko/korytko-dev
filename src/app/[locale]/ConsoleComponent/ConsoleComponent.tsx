'use client';

import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Rnd } from 'react-rnd';

import {
  ConsoleComponentProps,
  ConsoleData,
  SectionsObject,
  Size,
} from '@/app/[locale]/ConsoleComponent/ConsoleComponent.type';
import { Sections } from '@/app/api/sections/getSections.type';

import ConsoleComponentButtons from '@/app/[locale]/ConsoleComponent/ConsoleComponentButtons';
import ConsoleComponentHeaderLinks from '@/app/[locale]/ConsoleComponent/ConsoleComponentHeaderLinks';

import AnimateApp from '@/components/AnimateApp';
import Conditional from '@/components/Conditional';
import WindowWrapper from '@/components/WindowWrapper/WindowWrapper';
import { isWindowAnimated } from '@/components/WindowWrapper/WindowWrapper.helpers';

import './ConsoleComponent.animations.scss';
import styles from './ConsoleComponent.module.scss';

import useAnimations from '@/custom-hooks/useAnimations';

function ConsoleComponent(props: ConsoleComponentProps) {
  const {
    closeApp, minimizeApp, visible, sections, centered = true,
  } = props;

  const [consoleData, setConsoleData] = useState<ConsoleData>({
    size: {
      width: 1000,
      height: 0,
    },
    fullscreen: false,
    headerVisible: false,
    sections: {},
  });
  const nodeRef = React.useRef<Rnd | null>(null);

  const animations = useAnimations({
    defaultAnimations: {
      open: {
        status: true,
        animation: `animate-appear${centered ? '-centered' : ''}`,
      },
      close: {
        status: false,
        animation: 'animate-disappear',
        callback: closeApp,
        preserve: true,
      },
      minimize: {
        status: false,
        animation: 'animate-minimize',
        callback: minimizeApp,
      },
    },
  });

  useEffect(() => {
    if (!sections) {
      fetch('/api/sections')
        .then((response) => response.json())
        .then((data: Sections) => {
          const sectionsObject: SectionsObject = {};
          Object.keys(data).forEach((val) => {
            sectionsObject[data[val].name] = `#${val}`;
          });
          setConsoleData((prevState) => ({
            ...prevState,
            sections: sectionsObject,
          }));
        });
    } else {
      setConsoleData((prevState) => ({
        ...prevState,
        sections,
      }));
    }
  }, [sections]);

  const setConsoleSize = useCallback(({ width, height }: Size) => {
    setConsoleData((prevState) => ({
      ...prevState,
      size: {
        width, height,
      },
    }));
  }, []);

  const toggleFullscreen = () => setConsoleData((
    { fullscreen, ...rest },
  ) => ({ ...rest, fullscreen: !fullscreen }));
  const toggleMenu = () => setConsoleData((
    { headerVisible, ...rest },
  ) => ({ ...rest, headerVisible: !headerVisible }));
  const shouldRenderWindow = Object.keys(consoleData.sections).length !== 0;
  const shouldRenderHeader = consoleData.size.width > 0 && consoleData.size.width < 700;

  const callbacks = {
    minimize: () => animations.setStatus('minimize', true),
    close: () => animations.setStatus('close', true),
    maximize: toggleFullscreen,
  };

  const isAnimated = isWindowAnimated(animations.animations);

  return (
    <Conditional showWhen={shouldRenderWindow}>
      <AnimateApp
        statusCallback={animations.setStatus}
        animations={animations.animations}
      >
        <WindowWrapper
          ref={nodeRef}
          isWindowAnimated={isAnimated}
          onResize={setConsoleSize}
          initialHeight="95%"
          initialWidth="90%"
          fullscreen={consoleData.fullscreen}
          className={`${styles['console-component']} flex flex-col ${!visible && 'invisible'}`}
          minConstraints={{ width: 385, height: 85 }}
          handle={styles['console-header-handler']}
          centered={centered}
        >
          <header className={styles['console-header']} is-mobile={shouldRenderHeader.toString()}>
            <ConsoleComponentHeaderLinks.Hamburger
              showWhen={shouldRenderHeader}
              onClick={toggleMenu}
            />
            <div className={`${styles['console-header-handler']} absolute w-full h-full z-0 left-0 top-0`} />
            <div className={styles['console-header-name']}>
              <h4 className="z-10">
                jakub@korytko.dev: ~
              </h4>
            </div>
            <ConsoleComponentButtons callbacks={callbacks} fullscreen={consoleData.fullscreen} />
            <ConsoleComponentHeaderLinks
              sections={consoleData.sections}
              consoleSize={consoleData.size}
              menuVisibility={consoleData.headerVisible}
            />
          </header>
          <div className={`${styles['console-content']} flex-grow`} />
        </WindowWrapper>
      </AnimateApp>
    </Conditional>
  );
}

export default ConsoleComponent;
