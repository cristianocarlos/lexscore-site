import './styles/prepend-and-append.css';

import type {CSSProperties, ReactNode} from 'react';

type IPAppendIcon = {
  children: ReactNode;
  style: CSSProperties;
  type?: string;
};

export default function AppendIcon({children, style, type = 'default'}: IPAppendIcon) {
  return (
    <span className={`mf__formigo__prepend-and-append append append-${type}`} style={style}>
      {children}
    </span>
  );
}
