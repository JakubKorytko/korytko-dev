import React from 'react';
import Image from 'next/image';
import powerIcon from '../../../public/icons/power.svg';
import Clock from '@/app/[locale]/Clock';
import styles from './TaskBar.module.scss';

function TaskBar() {
  return (
    <nav className={`${styles['task-bar']} text-white bg-black bg-opacity-70 task-bar flex flex-row justify-between w-full h-10 md:h-9`}>
      <div className="xl:basis-2/12 md:basis-4/12 sm:basis-5/12 basis-6/12 lg:basis-3/12 flex justify-start flex-row items-center">
        <button type="button" className={`${styles['turn-off-button']} h-4/6 w-fit mx-2 filter-white turn-off-button`}>
          <Image
            priority
            src={powerIcon}
            alt="Turn off the system"
            className="w-full h-full"
          />
        </button>
        <input type="text" placeholder="Search" className={`${styles['search-bar']} grow mr-2 rounded-full md:rounded-lg`} size={1} />
      </div>
      <div className="basis-2/12 md:basis-3/12 xl:basis-2/12 text-sm md:text-base">
        <Clock />
      </div>
    </nav>
  );
}

export default TaskBar;
