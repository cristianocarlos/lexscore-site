import {
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputValidate,
  useDispatchFormigoProduceFormState,
  useStoreFormigoAttrGetValue,
} from '@/components/formigo/zustand/hooks';

import type {IPCheckGroup, TCheckGroupValue} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TCheckGroupCheckValue} from '@/components/formigo/types/checkOrRadio';
import type {TInputChangeEventHandler} from '@/types/common';

type TUseCheckGroupHandlers = {
  attribute: IPCheckGroup['attribute'];
  disabled: IPCheckGroup['disabled'];
  handleChange: IPCheckGroup['handleChange'];
  options: IPCheckGroup['options'];
  readOnly: IPCheckGroup['readOnly'];
  refComponent: IPCheckGroup['refComponent'];
  validateOnlyOnSubmit: IPCheckGroup['validateOnlyOnSubmit'];
};

export default function useCheckGroupHandlers(params: TUseCheckGroupHandlers) {
  const {attribute, disabled, handleChange, options, readOnly, refComponent, validateOnlyOnSubmit} = params;

  const inputResetErrors = useDispatchFormigoInputResetErrors(attribute);
  const inputValidate = useDispatchFormigoInputValidate(attribute);
  const produceFormState = useDispatchFormigoProduceFormState();
  const attrGetValue = useStoreFormigoAttrGetValue<TCheckGroupValue>(attribute);

  const replaceValue = (value?: TCheckGroupValue) => {
    produceFormState((proxyState, {mutatorAttrSetValueIn}) => {
      mutatorAttrSetValueIn(proxyState, attribute, value);
    });
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const checkAll = () => {
    const allValue = options.reduce((accumulator, data) => {
      const optionId = data.id.toString();
      accumulator[optionId] = optionId;
      return accumulator;
    }, {} as TCheckGroupValue);
    replaceValue(allValue);
  };

  const changeState = (checkValue: TCheckGroupCheckValue, isChecked: boolean) => {
    produceFormState((proxyState, {attrGetValueIn, mutatorAttrSetValueIn}) => {
      const currentSelection = attrGetValueIn<TCheckGroupValue>(proxyState, attribute);
      if (isChecked) {
        const checkedItem = {[checkValue]: checkValue};
        mutatorAttrSetValueIn(proxyState, attribute, {...currentSelection, ...checkedItem});
      } else if (currentSelection && Object.keys(currentSelection).length === 1) {
        // Desmarcou último ítem
        mutatorAttrSetValueIn(proxyState, attribute, undefined);
      } else {
        // Desmarcou algum ítem
        delete currentSelection?.[checkValue];
      }
    });
    if (!validateOnlyOnSubmit) {
      inputResetErrors();
      inputValidate();
    }
    if (typeof handleChange === 'function') {
      handleChange({
        checkedValues: attrGetValue(),
        checkValue,
        isChecked,
      });
    }
  };

  const handleInputChange: TInputChangeEventHandler = (e) => {
    if (disabled || readOnly) return;
    changeState(e.target.value, e.target.checked);
  };

  if (refComponent) {
    refComponent.current = {
      changeState,
      checkAll,
      replaceValue,
      resetError: inputResetErrors,
      resetValue,
    };
  }

  return {
    handleInputChange,
  };
}
