import { Apps } from '@/data/apps';

export type Icon = {
  key: Apps,
  icon: {
    name: string;
    image: string;
  },
  component: React.ReactNode;
};
