import React from 'react';
import Image from 'next/image';
import powerIcon from '../../../public/icons/power.svg';
import Clock from '@/app/[locale]/Clock';

function TaskBar() {
  return (
    <nav className="text-white bg-black task-bar flex flex-row justify-between w-full h-10 md:h-8">
      <div className="xl:basis-2/12 md:basis-4/12 sm:basis-5/12 basis-6/12 lg:basis-3/12 flex justify-start flex-row items-center">
        <Image
          priority
          src={powerIcon}
          alt="Turn off the system"
          className="h-4/5 w-fit mx-2 filter-white"
        />
        <input type="text" className="grow mr-2" size={1} />
      </div>
      <div className="basis-2/12 md:basis-3/12 lg:basis-2/12 text-xs md:text-base">
        <Clock />
      </div>
    </nav>
  );
}

export default TaskBar;
