import styles from './BackgroundFallback.module.css';

import type {ComponentProps} from 'react';

export default function BackgroundFallback({className = '', ...htmlProps}: ComponentProps<'div'>) {
  return <div {...htmlProps} className={`${styles.wrapper} ${className}`} />;
}
