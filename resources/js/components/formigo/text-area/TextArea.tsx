import '@/components/formigo/styles/input-and-textarea.css';

import {useRef} from 'react';

import InputPrepend from '@/components/formigo/InputPrepend';
import InputWrapper from '@/components/formigo/InputWrapper';
import useTextInputHandlers from '@/components/formigo/text-input/useTextInputHandlers';
import {resolveInputValue} from '@/components/formigo/utils/helper';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/components/formigo/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import InputPrint from '../InputPrint';
import TextAreaCounter from './TextAreaCounter';
import useTextAreaInitProps from './useTextAreaInitProps';

import type {IPTextArea} from '@/components/formigo/types/input';

export default function TextArea(props: IPTextArea) {
  const {
    attribute,
    className = '',
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    iconName = 'linecons-bubble',
    initValue,
    label,
    labelHint,
    maxLength,
    placeholder,
    printMode,
    readOnly,
    refComponent,
    refHtmlTextArea,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlTextAreaDefault = useRef<HTMLTextAreaElement>(null);
  const refHtmlTextAreaResolved = refHtmlTextArea || refHtmlTextAreaDefault; // Quando vem nas props, tem preferência

  /**
   * HANDLERS
   */

  const {handleInputBlur, handleInputChange, handleInputFocus} = useTextInputHandlers({
    attribute,
    disabled,
    handleBlur,
    handleFocus,
    readOnly,
    refComponent,
    refHtmlInput: refHtmlTextAreaResolved,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useTextAreaInitProps({
    attribute,
    hasPrepend: !!iconName,
    label,
    maxLength,
    placeholder,
    shouldUseModelSchemaMaxLength: true,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue);
  });

  /**
   * VALIDATORS
   */

  useValidators(
    {
      attribute,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.input,
    },
    validators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return null;

  // console.log('TextArea', attribute);

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'TextArea', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={`mf__formigo__input-and-textarea text-area ${className}`}
      inputId={initProps.id}
      label={label || initProps.label}
      labelHint={labelHint}
    >
      {printMode ? (
        <InputPrint value={resolvedInputValue} />
      ) : (
        <div className="input">
          <textarea
            disabled={disabled}
            id={initProps.id}
            maxLength={initProps.maxLength}
            name={initProps.name}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlTextAreaResolved}
            style={initProps.inputStyle} /* inputStyle resolveInputStyle(!!iconName, false) */
            value={resolvedInputValue}
          />
          <InputPrepend iconName={iconName} style={initProps.prependStyle} />
        </div>
      )}
      {!printMode && initProps.maxLength && <TextAreaCounter maxLength={initProps.maxLength} value={attrValue} />}
    </InputWrapper>
  );
}
