import '@/components/formigo/styles/check-switch.css';

import FieldWrapper from '@/components/formigo/FieldWrapper';
import Label from '@/components/formigo/Label';
import {CHECK_BOOL_FALSE, CHECK_BOOL_TRUE} from '@/components/formigo/utils/checkOrRadio';
import {resolveInputValue} from '@/components/formigo/utils/helper';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/components/formigo/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import CheckOption from './CheckOption';
import useCheckHandlers from './useCheckHandlers';

import type {IPCheckBox} from '@/components/formigo/types/checkOrRadio';

export default function CheckBox(props: IPCheckBox) {
  const {
    attribute,
    checkValue = CHECK_BOOL_TRUE,
    className = 'default',
    disabled,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    label,
    printMode,
    readOnly,
    refComponent,
    required,
    uncheckValue = CHECK_BOOL_FALSE,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange} = useCheckHandlers({
    attribute,
    checkValue,
    disabled,
    handleChange,
    readOnly,
    refComponent,
    uncheckValue,
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
      checkValue,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.checkBox,
    },
    validators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return null;

  const resolvedLabel = label || initProps.label;

  return (
    <FieldWrapper
      attribute={attribute}
      className={`mf__formigo__check-and-radio check-and-radio check ${className} ${printMode ? 'print-mode' : ''}`}
      role="checkbox"
    >
      <CheckOption
        checkValue={checkValue}
        className="box"
        disabled={disabled}
        handleChange={handleInputChange}
        id={initProps.id}
        label={
          resolvedLabel ? (
            <Label className="option-label" htmlFor={initProps.id}>
              {resolvedLabel}
            </Label>
          ) : null
        }
        name={initProps.name}
        printMode={printMode}
        readOnly={readOnly}
        value={resolveInputValue(attrValue, uncheckValue, 'CheckBox', attribute)}
      />
    </FieldWrapper>
  );
}
