import { useState } from 'react';
import { Apps } from '@/data/apps';
import { App } from '@/utils/getAppsData.type';
import appsData, { getAppComponents } from '@/utils/getAppsData';
import ProgramIcon from '@/app/[locale]/Desktop/ProgramIcon';

const setAppProperty = (
  apps: Record<Apps, App>,
  app: Apps,
  property: keyof App,
  status: boolean,
): Record<Apps, App> => {
  if (status === apps[app][property]) return apps;
  return {
    ...apps,
    [app]: {
      ...apps[app],
      [property]: status,
    },
  };
};

function useAppsLogic() {
  const [apps, setApps] = useState<Record<Apps, App>>(appsData());

  const closeApp = (app: Apps) => setApps(setAppProperty(apps, app, 'opened', false));

  const openApp = (app: Apps) => setApps(setAppProperty(apps, app, 'opened', true));

  const minimizeApp = (app: Apps) => setApps(setAppProperty(apps, app, 'minimized', true));

  const unminimizeApp = (app: Apps) => setApps(setAppProperty(apps, app, 'minimized', false));

  const generateAppIcon = (app: App) => (
    <ProgramIcon onClick={() => openApp(app.key)} key={app.key}>
      <ProgramIcon.Image src={app.icon.image} />
      <ProgramIcon.Name>{app.icon.name}</ProgramIcon.Name>
    </ProgramIcon>
  );

  const generateMinimizedApp = (app: App) => {
    const style = {
      root: {
        width: 'auto',
        height: '100%',
      },
      image: {
        width: '100%',
        height: '90%',
      },
      hr: {
        width: '35%',
        border: '0.2rem solid #D9D9D9',
        borderRadius: '999999px',
      },
    };

    return (
      <ProgramIcon
        onClick={() => unminimizeApp(app.key)}
        key={app.key}
        size={style.root}
      >
        <ProgramIcon.Image
          src={app.icon.image}
          size={style.image}
        />
        <hr style={style.hr} />
      </ProgramIcon>
    );
  };

  const components = getAppComponents(closeApp, minimizeApp, apps);

  const icons = Object.values(apps).map(
    (appData) => generateAppIcon(appData),
  );

  const minimized = Object.entries(apps)
    .map(([_, app]) => (app.minimized ? generateMinimizedApp(app) : null));

  const active = Object.entries(apps)
    .map(([_, app]) => (app.opened ? components[app.key] : null));

  return {
    icons, active, minimized,
  };
}

export default useAppsLogic;
