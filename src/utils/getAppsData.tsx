import { Apps, apps } from '@/data/apps';
import { App, GetAppComponents } from '@/utils/getAppsData.type';

const getAppsData = (): Record<Apps, App> => {
  const entries = Object.entries(apps).map(([, app]) => [
    app.enumValue, {
      key: app.enumValue,
      icon: {
        name: app.name,
        image: app.icon,
      },
      opened: false,
      minimized: false,
    },
  ]);

  return Object.fromEntries(entries);
};

const getAppComponents: GetAppComponents = (closeAppCallback, minimizeAppCallback, data) => {
  const entries = Object.entries(apps)
    .map(([, app]) => [
      [app.enumValue], <app.component
        key={app.enumValue}
        closeApp={() => closeAppCallback(app.enumValue)}
        minimizeApp={() => minimizeAppCallback(app.enumValue)}
        visible={!data[app.enumValue].minimized}
      />]);

  return Object.fromEntries(entries);
};

export default getAppsData;
export { getAppComponents };
