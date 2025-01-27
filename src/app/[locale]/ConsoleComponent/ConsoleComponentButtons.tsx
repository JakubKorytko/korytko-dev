import React from 'react';
import Image from 'next/image';

import { ConsoleComponentButtonsProps } from '@/app/[locale]/ConsoleComponent/ConsoleComponent.type';

import styles from '@/app/[locale]/ConsoleComponent/ConsoleComponent.module.scss';

import closeIcon from '#public/icons/close.svg';
import maximizeIcon from '#public/icons/maximize.svg';
import minimizeIcon from '#public/icons/minimize.svg';
import restoreIcon from '#public/icons/restore.svg';

function ConsoleComponentButtons(props: ConsoleComponentButtonsProps) {
  const { callbacks, fullscreen } = props;
  const { minimize, maximize, close } = callbacks;

  return (
    <div className={styles['console-header-buttons']}>
      <button type="button" className={`${styles['console-header-button']}`} onClick={minimize}>
        <Image
          src={minimizeIcon}
          alt="Minimize console button"
          className={`h-full w-full ${styles['filter-BEBEBE']}`}
        />
      </button>
      <button type="button" className={`${styles['console-header-button']}`} onClick={maximize}>
        <Image
          src={fullscreen ? restoreIcon : maximizeIcon}
          alt="Maximize console button"
          className={`h-full w-full ${styles['filter-BEBEBE']}`}
        />
      </button>
      <button type="button" className={`${styles['console-header-button']}`} onClick={close}>
        <Image
          src={closeIcon}
          alt="Close console button"
          className={`h-full w-full ${styles['filter-C77777']}`}
        />
      </button>
    </div>
  );
}

export default ConsoleComponentButtons;
