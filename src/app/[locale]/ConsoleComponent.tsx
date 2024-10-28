'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ConsoleComponent.module.scss';
import closeIcon from '../../../public/icons/close.svg';
import minimizeIcon from '../../../public/icons/minimize.svg';
import maximizeIcon from '../../../public/icons/maximize.svg';
import hamburgerIcon from '../../../public/icons/hamburger.svg';
import useScreenSize from '@/custom-hooks/useScreenSize';

function Conditional(
  { showWhen, children }:
  { showWhen: boolean, children: React.JSX.Element | React.JSX.Element[]
  },
) {
  if (showWhen) return children;
  return null;
}

function ConsoleComponent() {
  const screenSize = useScreenSize();
  const [menuVisibility, setMenuVisibility] = useState(false);

  const toggleMenu = () => {
    setMenuVisibility(!menuVisibility);
  };

  const sections: Record<string, string> = {
    'About Me': '#',
    Projects: '#',
    Experience: '#',
    Languages: '#',
    Education: '#',
    Skills: '#',
    Certificates: '#',
  };

  const links = Object.keys(sections).map(
    (key) => (
      <li key={key} className="md:float-left">
        <Link href={sections[key]} className="block px-2">
          {key}
        </Link>
      </li>
    ),
  );

  const isScreenBelow768px = screenSize.width < 768;
  const isScreenSizeCalculated = screenSize.width !== 0 && screenSize.height !== 0;

  return (
    <dialog open className={`${styles['console-component']} flex flex-col`}>
      <header className={styles['console-header']}>
        <Conditional showWhen={isScreenSizeCalculated}>
          <Conditional showWhen={isScreenBelow768px}>
            <div className={styles['hamburger-wrapper']}>
              <button type="button" className={styles['header-button']} onClick={toggleMenu}>
                <Image className={`h-full w-full ${styles['filter-BEBEBE']}`} src={hamburgerIcon} alt="Dropdown the menu icon (Hamburger)" />
              </button>
            </div>
          </Conditional>
          <div className={styles['console-header-name']}>
            <h4>
              jakub@korytko.dev: ~
            </h4>
          </div>
          <div className={styles['console-header-buttons']}>
            <button type="button" className={`${styles['header-button']}`}>
              <Image src={minimizeIcon} alt="Minimize console button" className={`h-full w-full ${styles['filter-BEBEBE']}`} />
            </button>
            <button type="button" className={`${styles['header-button']}`}>
              <Image src={maximizeIcon} alt="Maximize console button" className={`h-full w-full ${styles['filter-BEBEBE']}`} />
            </button>
            <button type="button" className={`${styles['header-button']}`}>
              <Image src={closeIcon} alt="Close console button" className={`h-full w-full ${styles['filter-C77777']}`} />
            </button>
          </div>
          <Conditional showWhen={!isScreenBelow768px || menuVisibility}>
            <nav className={styles['console-header-links']}>
              <Conditional showWhen={isScreenBelow768px}>
                <div className={`${styles['modal-menu-header']} flex flex-row w-full`}>
                  <div className="basis-3/12" />
                  <div className="basis-6/12 flex justify-center">
                    <h4 className="p-2">Options</h4>
                  </div>
                  <div className="basis-3/12 justify-center items-center flex">
                    <button type="button" className={`${styles['header-button']}`}>
                      <Image
                        src={closeIcon}
                        alt="Close console button"
                        className={`h-full w-full ${styles['filter-BEBEBE']}`}
                      />
                    </button>
                  </div>
                </div>
              </Conditional>
              <ul className="overflow-hidden pb-1 pl-1">
                {links}
              </ul>
            </nav>
          </Conditional>
        </Conditional>
      </header>
      <div className={`${styles['console-content']} flex-grow`} />
    </dialog>
  );
}

export default ConsoleComponent;
