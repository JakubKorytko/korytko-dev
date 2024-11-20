'use client';

import '@/styles/main.scss';
import { useState } from 'react';
import styles from './Desktop.module.scss';
import TaskBar from '@/app/[locale]/TaskBar/TaskBar';
import ConsoleComponent from '@/app/[locale]/ConsoleComponent/ConsoleComponent';
import ProgramIcon from '@/app/[locale]/Desktop/ProgramIcon';
import TerminalSVG from '../../../../public/icons/terminal.svg';

enum Apps {
  Kodos,
}

type Icon = {
  key: Apps,
  icon: {
    name: string;
    image: string;
  },
  component: React.ReactNode;
};

export default function DesktopComponent() {
  const [openedApps, setOpenedApps] = useState<Apps[]>([]);

  const closeApp = (app: Apps) => {
    if (!openedApps.includes(app)) return;

    setOpenedApps(
      openedApps.filter((item) => item !== app),
    );
  };

  const appsData: Record<Apps, Icon> = {
    [Apps.Kodos]: {
      key: Apps.Kodos,
      icon: {
        name: 'kodos',
        image: TerminalSVG,
      },
      component: <ConsoleComponent key={Apps.Kodos} closeApp={() => closeApp(Apps.Kodos)} />,
    },
  };

  const openApp = (app: Apps) => {
    if (openedApps.includes(app)) return;

    setOpenedApps(
      [...openedApps, app],
    );
  };

  const generateAppIcon = (appIcon: Icon) => (
    <ProgramIcon onClick={() => openApp(appIcon.key)} key={appIcon.key}>
      <ProgramIcon.Image src={appIcon.icon.image} />
      <ProgramIcon.Name>{appIcon.icon.name}</ProgramIcon.Name>
    </ProgramIcon>
  );

  const appIcons = Object.values(appsData).map(
    (appData) => generateAppIcon(appData),
  );

  const activeWindows = openedApps.map((app: Apps) => appsData[app].component);

  return (
    <div className={`w-full h-full flex flex-col ${styles['desktop-background']}`}>
      <TaskBar />
      <div className="grow relative overflow-hidden">
        <div className="flex justify-center items-center absolute w-full h-full left-0 top-0">
          {activeWindows}
        </div>
        <div className={`grow relative overflow-hidden ${styles['desktop-content']} p-4`}>
          {appIcons}
        </div>
      </div>
    </div>
  );
}
