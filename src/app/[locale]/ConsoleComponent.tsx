'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ConsoleComponent.module.scss';
import ConsoleComponentHeaderLinks from '@/app/[locale]/ConsoleComponentHeaderLinks';
import minimizeIcon from '../../../public/icons/minimize.svg';
import maximizeIcon from '../../../public/icons/maximize.svg';
import closeIcon from '../../../public/icons/close.svg';
import WindowWrapper from '@/app/[locale]/WindowWrapper';

function ConsoleComponent() {
  const sections: Record<string, string> = {
    'About Me': '#',
    Projects: '#',
    Experience: '#',
    Languages: '#',
    Education: '#',
    Skills: '#',
    Certificates: '#',
  };

  const [consoleSize, setConsoleSize] = useState({
    width: 0,
    height: 0,
  });

  return (
    <WindowWrapper
      initialHeight="95%"
      initialWidth="90%"
      height={consoleSize.height}
      width={consoleSize.width}
      resizeCallback={setConsoleSize}
      className={`${styles['console-component']} flex flex-col`}
      minConstraints={[385, 85]}
      handle={`.${styles['console-header-handler']}`}
    >
      <header className={styles['console-header']}>
        <div className={`${styles['console-header-handler']} absolute w-full h-full z-0 left-0 top-0`} />
        <div className={styles['console-header-name']}>
          <h4 className="z-10">
            jakub@korytko.dev: ~
          </h4>
        </div>
        <div className={styles['console-header-buttons']}>
          <button type="button" className={`${styles['header-button']}`}>
            <Image
              src={minimizeIcon}
              alt="Minimize console button"
              className={`h-full w-full ${styles['filter-BEBEBE']}`}
            />
          </button>
          <button type="button" className={`${styles['header-button']}`}>
            <Image
              src={maximizeIcon}
              alt="Maximize console button"
              className={`h-full w-full ${styles['filter-BEBEBE']}`}
            />
          </button>
          <button type="button" className={`${styles['header-button']}`}>
            <Image
              src={closeIcon}
              alt="Close console button"
              className={`h-full w-full ${styles['filter-C77777']}`}
            />
          </button>
        </div>
        <ConsoleComponentHeaderLinks sections={sections} consoleSize={consoleSize} />
      </header>
      <div className={`${styles['console-content']} flex-grow`} />
    </WindowWrapper>
  );
}

export default ConsoleComponent;
