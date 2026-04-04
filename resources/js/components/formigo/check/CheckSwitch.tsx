import '@/components/formigo/styles/check-switch.css';

import FieldWrapper from '@/components/formigo/FieldWrapper';
import Label from '@/components/formigo/Label';
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

export default function CheckSwitch(props: IPCheckBox) {
  const {
    attribute,
    checkValue = '1',
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
    uncheckValue = '0',
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
      className={`mf__formigo__check-switch check ${className} ${printMode ? 'print-mode' : ''}`}
      role="checkbox"
    >
      <CheckOption
        checkValue={checkValue}
        className="switch"
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
        value={resolveInputValue(attrValue, uncheckValue, 'CheckSwitch', attribute)}
      />
    </FieldWrapper>
  );
}
