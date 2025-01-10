import React from 'react';
import { Apps } from '@/data/apps';

export type App = {
  key: Apps,
  icon: {
    name: string;
    image: string;
  },
  opened: boolean,
  minimized: boolean,
};

export type CloseAppCallback = (app: Apps) => void;
export type MinimizeAppCallback = (app: Apps) => void;

export type GetAppComponents = (
  closeAppCallback: CloseAppCallback,
  minimizeAppCallback: MinimizeAppCallback,
  data: Record<Apps, App>
) => Record<Apps, React.ReactNode>;
