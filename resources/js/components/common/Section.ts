import {createElement} from 'react';

import type {CSSProperties, ReactNode} from 'react';

type IPSection = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tagName?: string;
};

function Section(props: IPSection) {
  const {children, className = '', style, tagName = 'section'} = props;
  return createElement(
    tagName,
    {
      className: `rounded-lg bg-white p-10 shadow-lg max-sm:p-4 ${className}`,
      style,
    },
    children,
  );
}

export default Section;
