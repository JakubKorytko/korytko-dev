'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ConsoleComponent.module.scss';
import ConsoleComponentHeaderLinks from '@/app/[locale]/ConsoleComponentHeaderLinks';
import minimizeIcon from '../../../public/icons/minimize.svg';
import maximizeIcon from '../../../public/icons/maximize.svg';
import closeIcon from '../../../public/icons/close.svg';

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

  return (
    <dialog open className={`${styles['console-component']} flex flex-col`}>
      <header className={styles['console-header']}>
        <div className={styles['console-header-name']}>
          <h4>
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
        <ConsoleComponentHeaderLinks sections={sections} />
      </header>
      <div className={`${styles['console-content']} flex-grow`} />
    </dialog>
  );
}

export default ConsoleComponent;
