import YiiLang from '~/phpgen/yii-lang';

import BackgroundFallback from '@/components/common/BackgroundFallback';

import type {ReactElement} from 'react';

export default function Rows<G>({children, rows}: {children: (rows: G) => ReactElement; rows?: G}) {
  if (!rows) return <BackgroundFallback className="h-40" />;
  const notFoundElement = <div className="agg--message-smooth">{YiiLang.misc('textNotFound')}</div>;
  if (Array.isArray(rows) && rows.length === 0) return notFoundElement;
  if (typeof rows === 'object' && 'items' in rows) {
    if (!rows.items) return notFoundElement;
    if (Array.isArray(rows.items) && rows.items.length === 0) return notFoundElement;
  }
  return children(rows);
}
