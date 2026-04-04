import './styles/prepend-and-append.css';

import SvgMap from '@/components/common/SvgMap';

import type {CSSProperties} from 'react';
import type {TSvgMapNames} from '~/phpgen/yii-svg-map';

export default function InputPrepend({iconName, style}: {iconName?: TSvgMapNames; style: CSSProperties}) {
  if (!iconName) return null;
  return (
    <span className={`mf__formigo__prepend-and-append prepend`} style={style}>
      <SvgMap name={iconName} />
    </span>
  );
}
