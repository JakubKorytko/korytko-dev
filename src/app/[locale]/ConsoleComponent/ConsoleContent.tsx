import { ReactNode } from 'react';
import { TypeAnimation } from 'react-type-animation';
import parse from 'html-react-parser';

import Conditional from '@/components/Conditional';

import styles from './ConsoleContent.module.scss';

function ConsoleContentText({ children }: { children: string | string[] }) {
  const text = typeof children === 'string' ? children : children.join('\n');
  const value = text
    .replaceAll('\n', '<br />')
    .replaceAll(/\[(.*)]\((.*)\)/g, "<a href='$2' target='_blank'>$1</a>");
  return parse(value);
}

function ConsoleContentLine({ lh, children }: { lh?: number, children: ReactNode }) {
  return (
    <div style={{
      width: '100%',
      height: lh ? `${lh}lh` : 'auto',
    }}
    >
      {children}
    </div>
  );
}

function ConsoleContentInput({ value }: { value?: string }) {
  return (
    <ConsoleContentLine>
      <span className={styles['text-primary']}>jakub@korytko.dev</span>
      <span>:</span>
      <span className={styles['text-tilde']}>~</span>
      <span>$&nbsp;</span>
      <Conditional showWhen={!!value}>
        <TypeAnimation className={styles['typing-text']} sequence={[value!]} />
      </Conditional>
    </ConsoleContentLine>
  );
}

function ConsoleContent({ children, inputValue }: {
  children: ReactNode | ReactNode[],
  inputValue?: string }) {
  return (
    <div className={styles['console-content']}>
      {children}
      {inputValue && <ConsoleContentInput value={inputValue} />}
    </div>
  );
}

ConsoleContent.Line = ConsoleContentLine;
ConsoleContent.Input = ConsoleContentInput;
ConsoleContent.Text = ConsoleContentText;

export default ConsoleContent;
