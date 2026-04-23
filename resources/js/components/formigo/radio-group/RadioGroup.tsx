import '@/components/formigo/styles/check-and-radio.css';

import FieldWrapper from '@/components/formigo/FieldWrapper';
import {getNoValueHiddenElement} from '@/components/formigo/utils/checkOrRadio';
import {resolveInputValue} from '@/components/formigo/utils/helper';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/components/formigo/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import {RadioGroupContext} from './RadioGroupContext';
import RadioGroupOptions from './RadioGroupOptions';
import useRadioGroupHandlers from './useRadioGroupHandlers';

import type {TRadioGroupOptionRows, TRadioGroupProps} from '@/components/formigo/types/radioGroup';

RadioGroup.Options = RadioGroupOptions;

export default function RadioGroup<GOptionData extends TRadioGroupOptionRows[number]>(
  props: TRadioGroupProps<GOptionData>,
) {
  const {
    attribute,
    className = '',
    children,
    disabled,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    label,
    pattern = 'default',
    preventUncheck,
    printMode,
    readOnly,
    refComponent,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange, handleInputClick} = useRadioGroupHandlers({
    attribute,
    disabled,
    handleChange,
    preventUncheck,
    readOnly,
    refComponent,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
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
      validationType: VALIDATION_TYPES.radioGroup,
    },
    validators || [],
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return null;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'RadioGroup', attribute);

  const readOnlyOrNoValueHiddenElement =
    readOnly && attrValue ? (
      <input disabled={disabled || printMode} name={initProps.name} type="hidden" value={resolvedInputValue} />
    ) : (
      getNoValueHiddenElement({
        disabled: disabled || printMode,
        initName: initProps.name,
        value: resolvedInputValue,
      })
    );

  const resolvedLabel = label || initProps.label;

  return (
    <RadioGroupContext
      value={{
        ...props,
        handleInputChange,
        handleInputClick,
        inputId: initProps.id,
        inputName: typeof readOnlyOrNoValueHiddenElement === 'undefined' ? initProps.name : undefined, // quando existir o hidden o Check não pode ter name [da pau no node]
        inputValue: resolvedInputValue,
      }}
    >
      <FieldWrapper
        attribute={attribute}
        className={`mf__formigo__check-and-radio check-and-radio radio-group ${className} ${pattern}-option`}
        data-test="form-element-radio-group"
        role="radiogroup"
      >
        {resolvedLabel ? <label className="agg--form-input-label">{resolvedLabel}</label> : undefined}
        {readOnlyOrNoValueHiddenElement}
        {children || <RadioGroup.Options />}
      </FieldWrapper>
    </RadioGroupContext>
  );
}
