'use client';

import TaskBar from '@/app/[locale]/TaskBar/TaskBar';

import Conditional from '@/components/Conditional';

import '@/styles/main.scss';
import styles from './Desktop.module.scss';

import useAppsLogic from '@/custom-hooks/useAppsLogic';

export default function DesktopComponent() {
  const { active, icons, minimized } = useAppsLogic();

  const areThereMinimizedApps = minimized.filter((x) => x).length > 0;

  return (
    <div className={`w-full h-full flex flex-col ${styles['desktop-background']}`}>
      <TaskBar />
      <div className="grow relative overflow-hidden">
        <div className="flex justify-center items-center absolute w-full h-full left-0 top-0">
          {active}
        </div>
        <div className={`grow relative overflow-hidden ${styles['desktop-content']} p-4`}>
          {icons}
        </div>
        <Conditional showWhen={areThereMinimizedApps}>
          <div className="flex justify-center items-center absolute w-full h-16 left-0 bottom-12">
            <div className={styles['desktop-minimized']}>
              {minimized}
            </div>
          </div>
        </Conditional>
      </div>
    </div>
  );
}
