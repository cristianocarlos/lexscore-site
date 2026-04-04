import {
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useStoreFormigoAttrGetValue,
} from '@/components/formigo/zustand/hooks';

import type {IPRadioGroup, TRadioCheckValue} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';

type TUseRadioGroupHandlers = {
  attribute: IPRadioGroup['attribute'];
  disabled: IPRadioGroup['disabled'];
  handleChange: IPRadioGroup['handleChange'];
  preventUncheck: IPRadioGroup['preventUncheck'];
  readOnly: IPRadioGroup['readOnly'];
  refComponent: IPRadioGroup['refComponent'];
  validateOnlyOnSubmit: IPRadioGroup['validateOnlyOnSubmit'];
};

export default function useRadioGroupHandlers(params: TUseRadioGroupHandlers) {
  const {attribute, disabled, handleChange, preventUncheck, readOnly, refComponent, validateOnlyOnSubmit} = params;

  const attrSetValue = useDispatchFormigoAttrSetValue(attribute);
  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const attrGetValue = useStoreFormigoAttrGetValue(attribute);

  const replaceValue = (value?: TRadioCheckValue) => {
    attrSetValue(value);
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const changeValue = (value?: TRadioCheckValue) => {
    attrSetValue(value);
    if (!validateOnlyOnSubmit) {
      inputResetErrors();
      inputValidate();
    }
    if (typeof handleChange === 'function') {
      handleChange(value);
    }
  };

  const handleInputChange: TInputChangeEventHandler = (e) => {
    if (disabled || readOnly) return;
    changeValue(e.target.value);
  };

  const handleInputClick: TInputMouseEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (!preventUncheck && e.currentTarget.value === attrGetValue()) {
      changeValue(undefined);
    }
  };

  if (refComponent) {
    refComponent.current = {
      replaceValue,
      resetError: inputResetErrors,
      resetValue,
    };
  }

  return {
    handleInputChange,
    handleInputClick,
  };
}
