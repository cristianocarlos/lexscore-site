import '@/components/formigo/styles/input-and-textarea.css';

import {useRef} from 'react';

import InputPrepend from '@/components/formigo/InputPrepend';
import InputWrapper from '@/components/formigo/InputWrapper';
import {heightStyle, prependStyle, resolveInputStyle} from '@/components/formigo/styles/layout';
import {resolveInputValue} from '@/components/formigo/utils/helper';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/components/formigo/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import InputPrint from '../InputPrint';
import useTextInputHandlers from './useTextInputHandlers';

import type {IPTextInput} from '@/components/formigo/types/input';

export default function TextInput(props: IPTextInput) {
  const {
    attribute,
    autoComplete = 'off',
    className = '',
    dataType,
    disabled,
    forceValidateOnSubmit,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handleKeyUp,
    iconName,
    initValue,
    label,
    labelHint,
    maxLength,
    placeholder,
    printMode,
    readOnly,
    refComponent,
    refHtmlInput,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlInputDefault = useRef<HTMLInputElement>(null);
  const refHtmlInputResolved = refHtmlInput || refHtmlInputDefault; // Quando vem nas props, tem preferência

  /**
   * HANDLERS
   */

  const {handleInputBlur, handleInputChange, handleInputFocus, handleInputKeyDown} = useTextInputHandlers({
    attribute,
    disabled,
    handleBlur,
    handleFocus,
    handleKeyDown,
    readOnly,
    refComponent,
    refHtmlInput: refHtmlInputResolved,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
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

  // console.log('TextInput', attribute);

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'TextInput', attribute);

  return (
    <InputWrapper
      attribute={attribute}
      className={`mf__formigo__input-and-textarea text-input ${className}`}
      inputId={initProps.id}
      label={label || initProps.label}
      labelHint={labelHint}
    >
      {printMode ? (
        <InputPrint value={resolvedInputValue} />
      ) : (
        <div className="input" style={heightStyle}>
          <input
            autoComplete={autoComplete}
            data-type={dataType}
            disabled={disabled}
            id={initProps.id}
            maxLength={initProps.maxLength}
            name={initProps.name}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={initProps.placeholder}
            readOnly={readOnly}
            ref={refHtmlInputResolved}
            style={resolveInputStyle(!!iconName, false)}
            type="text"
            value={resolvedInputValue}
          />
          <InputPrepend iconName={iconName} style={prependStyle} />
        </div>
      )}
    </InputWrapper>
  );
}
