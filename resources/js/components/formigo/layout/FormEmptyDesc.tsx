import YiiLang from '~/phpgen/yii-lang';

import type {ReactNode} from 'react';

type TProps = {
  children?: ReactNode;
  info?: string;
  title?: string;
};

export default function FormEmptyDesc(props: TProps) {
  const {
    children,
    info = YiiLang.formigo('fragmentEmpty'),
    title,
    ...htmlProps // Para os atributos data-*
  } = props;

  return children || children === 0 ? (
    <span {...htmlProps} title={title}>
      {children}
    </span>
  ) : (
    <span {...htmlProps} className="text-[0.9em] text-gray-300 lowercase" title={title}>
      {info}
    </span>
  );
}
