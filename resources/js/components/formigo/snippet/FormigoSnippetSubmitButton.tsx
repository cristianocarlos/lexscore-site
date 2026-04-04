import YiiLang from '~/phpgen/yii-lang';

import type {ComponentProps} from 'react';

export default function FormigoSnippetSubmitButton({children, className, ...htmlProps}: ComponentProps<'button'>) {
  return (
    <button {...htmlProps} className={`agg--button-primary ${className}`}>
      {children || YiiLang.formigo('labelFormSubmitButton')}
    </button>
  );
}
