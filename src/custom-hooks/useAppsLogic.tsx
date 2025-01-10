import { useState } from 'react';

import { AppsRecord, SetAppProperty } from '@/custom-hooks/useAppsLogic.type';
import { App } from '@/utils/getAppsData.type';

import ProgramIcon from '@/app/[locale]/Desktop/ProgramIcon';

import appsData, { getAppComponents } from '@/utils/getAppsData';

import { Apps } from '@/data/apps';

const setAppProperty: SetAppProperty = (apps, app, property, status) => {
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
  const [apps, setApps] = useState<AppsRecord>(appsData());

  const closeApp = (app: Apps) => setApps(setAppProperty(apps, app, 'opened', false));

  const openApp = (app: Apps) => setApps(setAppProperty(apps, app, 'opened', true));

  const minimizeApp = (app: Apps) => setApps(setAppProperty(apps, app, 'minimized', true));

  const restoreApp = (app: Apps) => setApps(setAppProperty(apps, app, 'minimized', false));

  const generateAppIcon = (app: App) => (
    <ProgramIcon onClick={() => openApp(app.key)} key={app.key}>
      <ProgramIcon.Image src={app.icon.image} />
      <ProgramIcon.Name>{app.icon.name}</ProgramIcon.Name>
    </ProgramIcon>
  );

  const generateMinimizedApp = (app: App) => (
    <ProgramIcon
      onClick={() => restoreApp(app.key)}
      key={app.key}
      minimized
    >
      <ProgramIcon.Image
        src={app.icon.image}
        minimized
      />
    </ProgramIcon>
  );

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
