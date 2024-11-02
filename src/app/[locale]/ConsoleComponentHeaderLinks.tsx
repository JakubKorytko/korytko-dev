'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ConsoleComponent.module.scss';
import closeIcon from '../../../public/icons/close.svg';
import hamburgerIcon from '../../../public/icons/hamburger.svg';

function Conditional(
  { showWhen, children }:
  {
    showWhen: boolean, children: React.JSX.Element | React.JSX.Element[]
  },
) {
  if (showWhen) return children;
  return null;
}

function Hamburger(props: { onClick: () => void, showWhen: boolean }) {
  const { onClick: toggleMenu, showWhen } = props;

  return (
    <Conditional showWhen={showWhen}>
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
  );
}

function ConsoleComponentHeaderLinks(props: {
  consoleSize: { width: number, height: number },
  sections: Record<string, string>,
  menuVisibility: boolean
}) {
  const { sections, consoleSize, menuVisibility } = props;
  const isMobile = consoleSize.width > 0 && consoleSize.width < 700;
  const displayLinks = consoleSize.width >= 700 || (consoleSize.width > 0 && menuVisibility);

  const links = Object.keys(sections).map(
    (key) => (
      <li key={key} className={!isMobile ? 'float-left' : ''}>
        <Link href={sections[key]} className="block px-2">
          {key}
        </Link>
      </li>
    ),
  );

  return (
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
  );
}

ConsoleComponentHeaderLinks.Hamburger = Hamburger;
export default ConsoleComponentHeaderLinks;
