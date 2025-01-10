export type ProgramIconImageProps = {
  src: string,
  minimized?: boolean
};

export type ProgramIconNameProps = {
  children: string
};

export type ProgramIconProps = {
  children: React.ReactNode | React.ReactNode[],
  onClick: () => void,
  minimized?: boolean
};
