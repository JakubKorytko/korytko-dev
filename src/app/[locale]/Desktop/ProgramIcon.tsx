import Image from 'next/image';

function ProgramIcon(props: {
  children: React.ReactNode | React.ReactNode[],
  onClick: () => void }) {
  const { children, onClick: clickCallback } = props;
  return (
    <button type="button" onClick={clickCallback} className="flex flex-col items-center w-5/6 h-5/6">
      {children}
    </button>
  );
}

function Name(props: { children: string }) {
  const { children } = props;
  return (<span>{children}</span>);
}

function PImage(props: { src: string }) {
  const { src } = props;
  return (
    <Image src={src} alt="Program icon" className="h-4/6 w-auto" />
  );
}

ProgramIcon.Name = Name;
ProgramIcon.Image = PImage;

export default ProgramIcon;
