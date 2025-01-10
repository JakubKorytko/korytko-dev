import React from 'react';

type ConditionalProps = { showWhen: boolean, children: React.JSX.Element | React.JSX.Element[] };

function Conditional({ showWhen, children }: ConditionalProps) {
  if (showWhen) return children;
  return null;
}

export default Conditional;
