import React from 'react';
import styles from './ConsoleComponent.module.scss';

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

  const links = Object.keys(sections).map(
    (key) => <li key={key} className="float-left"><a href={sections[key]} className="block px-2">{key}</a></li>,
  );

  return (
    <dialog open className={`${styles['console-component']} flex flex-col`}>
      <header className={styles['console-header']}>
        <div className={styles['console-header-name']}>
          <h4>jakub@korytko.dev: ~</h4>
        </div>
        <div className={styles['console-header-buttons']} />
        <nav className={styles['console-header-links']}>
          <ul className="overflow-hidden pb-1 pl-1">
            {links}
          </ul>
        </nav>
      </header>
      <div className="flex-grow" />
    </dialog>
  );
}

export default ConsoleComponent;
