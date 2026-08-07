import { Apps } from '@/data/apps';
import { App } from '@/utils/getAppsData.type';


export type AppsRecord = Record<Apps, App>;

export type SetAppProperty = (
  apps: Record<Apps, App>,
  app: Apps,
  property: keyof App,
  status: boolean
) => AppsRecord;
