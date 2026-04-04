import YiiLang from '~/phpgen/yii-lang';

import SvgMap from '@/components/common/SvgMap';

import type {ComponentProps} from 'react';

export type IPXIconButton = ComponentProps<'button'> & {
  className?: string;
  title?: string;
};

export default function XIconButton(props: IPXIconButton) {
  const {
    className,
    title = YiiLang.misc('textRemove'),
    ...htmlProps // Para os atributos data-*
  } = props;
  return (
    <button {...htmlProps} className={`mf__x-icon-button ${className}`} title={title} type="button">
      <SvgMap name="feather-x" />
    </button>
  );
}
