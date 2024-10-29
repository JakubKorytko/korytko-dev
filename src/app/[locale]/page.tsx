import '@/styles/main.scss';
import TaskBar from '@/app/[locale]/TaskBar';
import ConsoleComponent from '@/app/[locale]/ConsoleComponent';

export default function Index() {
  return (
    <div className="w-full h-full flex flex-col">
      <TaskBar />
      <div className="grow relative flex justify-center items-center overflow-hidden">
        <ConsoleComponent />
      </div>
    </div>
  );
}
