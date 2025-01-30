'use client';

import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Rnd } from 'react-rnd';
import { loremIpsum } from 'lorem-ipsum';

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

  const nodeRef = React.useRef<Rnd | null>(null);
  const [visibility, setVisibility] = useState(visible);

  const [consoleData, setConsoleData] = useState<ConsoleData>({
    size: {
      width: 1000,
      height: 0,
    },
    fullscreen: false,
    headerVisible: false,
    sections: {},
  });

  const animations = useAnimations({
    defaultAnimations: {
      open: { status: true, animation: `animate-appear${centered ? '-centered' : ''}` },
      close: { animation: 'animate-disappear', callback: closeApp, convertTranslate: true },
      minimize: {
        animation: 'animate-minimize',
        callback: () => {
          setVisibility(false);
          minimizeApp();
        },
        convertTranslate: true,
      },
      maximize: {
        animation: 'animate-maximize',
        runCallbackBeforeAnimation: true,
        callback: () => setConsoleData((data) => ({ ...data, fullscreen: true })),
      },
      maximizeRestore: {
        animation: 'animate-maximize-restore',
        runCallbackBeforeAnimation: true,
        callback: () => setConsoleData((data) => ({ ...data, fullscreen: false })),
      },
      minimizeRestore: {
        animation: 'animate-minimize-restore',
        runCallbackBeforeAnimation: true,
        callback: () => { setVisibility(true); },
        convertTranslate: true,
      },
    },
  });

  const setConsoleSize = useCallback(({ width, height }: Size) => {
    setConsoleData((prevState) => ({
      ...prevState,
      size: {
        width, height,
      },
    }));
  }, []);

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

  useEffect(() => {
    if (visible && visibility !== visible) {
      if (animations.animations.minimizeRestore.status !== true) animations.setStatus('minimizeRestore', true);
    } else {
      setVisibility(visible);
    }
  }, [visible, animations, visibility]);

  const toggleMenu = () => setConsoleData((
    { headerVisible, ...rest },
  ) => ({ ...rest, headerVisible: !headerVisible }));
  const shouldRenderWindow = Object.keys(consoleData.sections).length !== 0;
  const shouldRenderHeader = consoleData.size.width > 0 && consoleData.size.width < 700;

  const callbacks = {
    minimize: () => animations.setStatus('minimize', true),
    close: () => animations.setStatus('close', true),
    maximize: () => animations.setStatus(`maximize${consoleData.fullscreen ? 'Restore' : ''}`, true),
  };

  const text = useMemo(() => loremIpsum({ count: 100 }), []);

  return (
    <Conditional showWhen={shouldRenderWindow}>
      <AnimateApp
        statusCallback={animations.setStatus}
        animations={animations.animations}
      >
        <WindowWrapper
          ref={nodeRef}
          isWindowAnimated={isWindowAnimated(animations.animations)}
          onResize={setConsoleSize}
          initialHeight="95%"
          initialWidth="90%"
          fullscreen={consoleData.fullscreen}
          className={`${styles['console-component']} flex flex-col ${!visibility && 'invisible'}`}
          minConstraints={{ width: 385, height: 85 }}
          handle={styles['console-header-handler']}
          centered={centered}
        >
          <div className={styles['console-component-wrapper']}>
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
                isMobile={shouldRenderHeader}
              />
            </header>
            <div className={`${styles['console-content']}`}>
              <p>{text}</p>
              <div className={styles['blurry-bg']} />
            </div>
          </div>
        </WindowWrapper>
      </AnimateApp>
    </Conditional>
  );
}

export default ConsoleComponent;
