import '@/components/formigo/styles/wrapper.css';

import Formigo from '@/components/formigo/Formigo';
import Label from '@/components/formigo/Label';
import {useSelectorFormigoValidatorInputErrors} from '@/components/formigo/zustand/hooks';

import type {TFormigoAttribute, TFormigoLabel} from '@/components/formigo/types/formigo';
import type {ComponentProps, ReactNode} from 'react';

type TInputWrapper = ComponentProps<'div'> & {
  attribute: TFormigoAttribute;
  children: ReactNode;
  className?: string;
  inputId?: string; // id do input para o for do label
  label?: TFormigoLabel;
  labelHint?: string;
};

export default function InputWrapper(props: TInputWrapper) {
  const {attribute, children, className, label, labelHint, inputId, ...htmlDataAttributeProps} = props;

  const inputErrors = useSelectorFormigoValidatorInputErrors(attribute);

  const hasError = !!inputErrors;

  return (
    <Formigo.Element
      {...htmlDataAttributeProps}
      className={`mf__formigo__wrapper ${className} ${hasError ? 'has-error' : ''}`}
    >
      <Label className="agg--form-input-label" htmlFor={inputId} labelHint={labelHint}>
        {label}
      </Label>
      {children}
      {hasError ? <em>{inputErrors.join('; ')}</em> : null}
    </Formigo.Element>
  );
}
