import Image from 'next/image';

import { ProgramIconImageProps, ProgramIconNameProps, ProgramIconProps } from '@/app/[locale]/Desktop/ProgramIcon.type';

import styles from './Desktop.module.scss';

function ProgramIcon(props: ProgramIconProps) {
  const { children, onClick: clickCallback, minimized } = props;

  return (
    <button type="button" onClick={clickCallback} className={`flex flex-col items-center ${minimized ? styles['minimized-icon'] : 'w-5/6 h-5/6'}`}>
      {children}
      {minimized && (<hr className={styles['minimized-hr']} />)}
    </button>
  );
}

function ProgramIconName(props: ProgramIconNameProps) {
  const { children } = props;
  return (<span>{children}</span>);
}

function ProgramIconImage(props: ProgramIconImageProps) {
  const { src, minimized } = props;
  return (
    <Image src={src} alt="Program icon" className={minimized ? styles['minimized-image'] : 'h-4/6 w-auto'} />
  );
}

ProgramIcon.Name = ProgramIconName;
ProgramIcon.Image = ProgramIconImage;

export default ProgramIcon;
