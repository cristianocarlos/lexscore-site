import type {PropsWithChildren} from 'react';

export default function Content({children, className = ''}: PropsWithChildren & {className?: string}) {
  // min-w-0 hack necessario pro carrousel nao forçar largura maxima (mesmo hack da ellipsis)
  return <section className={`min-h-[48vh] min-w-0 flex-1 ${className}`}>{children}</section>;
}
