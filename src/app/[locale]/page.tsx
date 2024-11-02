import '@/styles/main.scss';
import styles from './Desktop.module.scss';
import TaskBar from '@/app/[locale]/TaskBar';
import ConsoleComponent from '@/app/[locale]/ConsoleComponent';
import ProgramIcon from '@/app/[locale]/ProgramIcon';

export default function Index() {
  return (
    <div className="w-full h-full flex flex-col">
      <TaskBar />
      <div className="grow relative overflow-hidden">
        <div className="flex justify-center items-center absolute w-full h-full left-0 top-0">
          <ConsoleComponent />
        </div>
        <div className={`grow relative overflow-hidden ${styles['desktop-content']} p-4`}>
          <ProgramIcon />
        </div>
      </div>
      {/* <div className="grow relative flex justify-center items-center overflow-hidden"> */}
      {/* <ConsoleComponent /> */}
      {/* </div> */}
    </div>
  );
}
