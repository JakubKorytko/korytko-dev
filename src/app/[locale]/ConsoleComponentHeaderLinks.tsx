'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ConsoleComponent.module.scss';
import closeIcon from '../../../public/icons/close.svg';
import hamburgerIcon from '../../../public/icons/hamburger.svg';
import useScreenSize from '@/custom-hooks/useScreenSize';

function Conditional(
  { showWhen, children }:
  {
    showWhen: boolean, children: React.JSX.Element | React.JSX.Element[]
  },
) {
  if (showWhen) return children;
  return null;
}

function ConsoleComponentHeaderLinks(props: { sections: Record<string, string> }) {
  const screenSize = useScreenSize();
  const [menuVisibility, setMenuVisibility] = useState(false);

  const { sections } = props;
  const isMobile = screenSize.width > 0 && screenSize.width < 768;
  const displayLinks = screenSize.width >= 768 || (screenSize.width > 0 && menuVisibility);

  const toggleMenu = () => {
    setMenuVisibility(!menuVisibility);
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

  return (
    <>
      <Conditional showWhen={isMobile}>
        <div className={styles['hamburger-wrapper']}>
          <button type="button" className={styles['header-button']} onClick={toggleMenu}>
            <Image
              className={`h-full w-full ${styles['filter-BEBEBE']}`}
              src={hamburgerIcon}
              alt="Dropdown the menu icon (Hamburger)"
            />
          </button>
        </div>
      </Conditional>
      <Conditional showWhen={displayLinks}>
        <nav className={styles['console-header-links']}>
          <Conditional showWhen={isMobile}>
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
    </>
  );
}

export default ConsoleComponentHeaderLinks;
