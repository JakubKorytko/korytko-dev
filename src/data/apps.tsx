import ConsoleComponent from '@/app/[locale]/ConsoleComponent/ConsoleComponent';

import TerminalSVG from '#public/icons/terminal.svg';

export enum Apps {
  Kodos,
}

export const apps = [
  {
    enumValue: Apps.Kodos,
    name: 'kodos',
    icon: TerminalSVG,
    component: ConsoleComponent,
  },
];
