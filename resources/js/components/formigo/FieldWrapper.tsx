import '@/components/formigo/styles/wrapper.css';

import Formigo from '@/components/formigo/Formigo';
import {useSelectorFormigoValidatorInputErrors} from '@/components/formigo/zustand/hooks';

import type {TFormigoAttribute} from '@/components/formigo/types/formigo';
import type {ComponentProps, ReactNode} from 'react';

type TFieldWrapper = ComponentProps<'div'> & {
  ariaRole?: string; // checks & radios
  attribute: TFormigoAttribute;
  children: ReactNode;
  className?: string;
};

export default function FieldWrapper(props: TFieldWrapper) {
  const {attribute, children, className, ...htmlDataAttributeProps} = props;

  const inputErrors = useSelectorFormigoValidatorInputErrors(attribute);

  const hasError = !!inputErrors;

  return (
    <Formigo.Element
      {...htmlDataAttributeProps}
      className={`mf__formigo__wrapper ${className} ${hasError ? 'has-error' : ''}`}
    >
      {children}
      {hasError ? <em>{inputErrors.join('; ')}</em> : null}
    </Formigo.Element>
  );
}
