'use client';

import React from 'react';
import styles from './index.module.scss';
import { TestComponentInterface } from '@/app/[locale]/TestComponent.type';

const TestComponent: TestComponentInterface = function TestComponent(props) {
  const { messages } = props;
  const { title, content } = messages;

  const [modifiedTitle, setModifiedTitle] = React.useState({
    value: title,
    modified: false,
  });

  const modifyTitle = () => {
    if (modifiedTitle.modified) {
      setModifiedTitle({
        value: title,
        modified: false,
      });
    } else {
      setModifiedTitle({
        value: modifiedTitle.value.toUpperCase(),
        modified: true,
      });
    }
  };

  return (
    <div className="p-6 max-w-sm bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div>
        <div className={`text-xl font-medium text-black ${styles.text}`}>
          {modifiedTitle.value}
        </div>
        <p className="text-slate-500">{content}</p>
        <button type="button" onClick={modifyTitle}>
          Modify title!
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
