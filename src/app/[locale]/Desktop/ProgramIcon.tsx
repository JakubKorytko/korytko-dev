import Image from 'next/image';

function ProgramIcon(props: {
  children: React.ReactNode | React.ReactNode[],
  onClick: () => void, size?: { width?: string, height?: string } }) {
  const { children, onClick: clickCallback, size } = props;

  return (
    <button type="button" onClick={clickCallback} className="flex flex-col items-center w-5/6 h-5/6" style={size}>
      {children}
    </button>
  );
}

function Name(props: { children: string }) {
  const { children } = props;
  return (<span>{children}</span>);
}

function PImage(props: { src: string, size?: { width?: string, height?: string } }) {
  const { src, size } = props;
  return (
    <Image src={src} alt="Program icon" className="h-4/6 w-auto" style={size} />
  );
}

ProgramIcon.Name = Name;
ProgramIcon.Image = PImage;

export default ProgramIcon;
