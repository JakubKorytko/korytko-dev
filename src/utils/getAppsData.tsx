import { Icon } from '@/utils/getAppsData.type';
import { Apps, apps } from '@/data/apps';

const getAppsData = (closeAppCallback: (app: Apps) => void): Record<Apps, Icon> => {
  const appsDataResult: Partial<Record<Apps, Icon>> = {};

  apps.forEach((app) => {
    appsDataResult[app.enumValue] = {
      key: app.enumValue,
      icon: {
        name: app.name,
        image: app.icon,
      },
      component: <app.component
        key={app.enumValue}
        closeApp={() => closeAppCallback(app.enumValue)}
      />,
    };
  });

  return appsDataResult as Record<Apps, Icon>;
};

export default getAppsData;
