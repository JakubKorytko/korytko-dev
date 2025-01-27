type VoidFunction = () => void;

export type Size = {
  width: number;
  height: number;
};

export type SectionsObject = Record<string, string>;

export type ConsoleData = {
  size: Size,
  fullscreen: boolean,
  headerVisible: boolean,
  sections: SectionsObject
};

export type ConsoleComponentButtonsProps = {
  callbacks: {
    minimize: VoidFunction,
    maximize: VoidFunction,
    close: VoidFunction,
  },
  fullscreen?: boolean
};

export type HamburgerProps = {
  onClick: VoidFunction,
  showWhen: boolean
};

export type ConsoleComponentHeaderLinksProps = {
  consoleSize: Size,
  sections: SectionsObject,
  menuVisibility: boolean
};

export type ConsoleComponentProps = {
  closeApp: VoidFunction,
  minimizeApp: VoidFunction,
  visible: boolean,
  sections?: SectionsObject,
  centered?: boolean
};
