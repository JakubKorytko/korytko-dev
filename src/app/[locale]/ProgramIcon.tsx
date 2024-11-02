import Image from 'next/image';
import TerminalSvg from '../../../public/icons/terminal.svg';

function ProgramIcon() {
  return (
    <div className="flex flex-col items-center w-5/6 h-5/6">
      <Image src={TerminalSvg} alt="Program icon" className="h-4/6 w-auto" />
      <span>kodos</span>
    </div>
  );
}

export default ProgramIcon;
