import {
  checkRequiredValidator,
  descriptionRequiredValidator,
  minSizeOneRequiredValidator,
  requiredValidator,
} from '@/components/formigo/utils/validators';
import {
  useDispatchFormigoInputAddValidator,
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoInputResetValidators,
} from '@/components/formigo/zustand/hooks';
import {useDidMountEffect, useDidUpdateEffect, useWillUnmountEffect} from '@/utils/hooks';

import type {IPCheckBox} from '@/components/formigo/types/checkOrRadio';
import type {IPComboOrSuggestBase} from '@/components/formigo/types/comboOrSuggest';
import type {IPFormigoElementBase1, TFormigoValidatorHandler} from '@/components/formigo/types/formigo';

type TUseValidators = {
  attribute: IPFormigoElementBase1['attribute'];
  checkValue?: IPCheckBox['checkValue']; // CheckBox/CheckSwitch
  comboOptionLabelAttribute?: IPComboOrSuggestBase['attribute']; // ComboBox/Select
  disabled: IPFormigoElementBase1['disabled'];
  forceValidateOnSubmit: IPFormigoElementBase1['forceValidateOnSubmit'];
  readOnly: IPFormigoElementBase1['readOnly'];
  required: IPFormigoElementBase1['required'];
  updateTriggerValue?: boolean; // Valor coringa pra forçar a atualização dos validators
  validationType: (typeof VALIDATION_TYPES)[keyof typeof VALIDATION_TYPES];
};

export const VALIDATION_TYPES = {
  checkBox: 'check-box',
  checkGroup: 'check-group',
  combo: 'combo',
  input: 'input',
  inputGroupSelection: 'input-group-selection',
  radioGroup: 'radio-group',
  radioTable: 'radio-table',
  suggest: 'suggest',
  tagSuggest: 'tag-suggest',
} as const;

export default function useValidators(
  params: TUseValidators,
  additionalValidators: Array<TFormigoValidatorHandler> = [],
) {
  const {
    attribute,
    checkValue, // CheckBox/CheckSwitch
    comboOptionLabelAttribute, // ComboBox/Select
    disabled,
    forceValidateOnSubmit,
    readOnly,
    required,
    updateTriggerValue, // Valor coringa pra forçar a atualização dos validators
    validationType,
  } = params;

  const addValidator = useDispatchFormigoInputAddValidator(attribute);
  const resetErrors = useDispatchFormigoInputResetErrors(attribute);
  const resetValidators = useDispatchFormigoInputResetValidators(attribute);

  const preventValidate = disabled || (readOnly && !forceValidateOnSubmit);

  const addValidators = () => {
    if (!preventValidate) {
      if (required) {
        switch (validationType) {
          case VALIDATION_TYPES.checkBox:
            addValidator(checkRequiredValidator({attribute, checkValue}));
            break;
          case VALIDATION_TYPES.combo:
            if (comboOptionLabelAttribute) {
              addValidator(descriptionRequiredValidator({comboOptionLabelAttribute}));
            }
            break;
          case VALIDATION_TYPES.checkGroup:
          case VALIDATION_TYPES.inputGroupSelection:
          case VALIDATION_TYPES.tagSuggest:
            addValidator(minSizeOneRequiredValidator({attribute}));
            break;
          default:
            // VALIDATION_TYPES.input
            // VALIDATION_TYPES.radioGroup
            // VALIDATION_TYPES.suggest
            addValidator(requiredValidator({attribute}));
        }
      }
      additionalValidators.forEach((validator) => {
        addValidator(validator);
      });
    }
  };

  useDidMountEffect(() => {
    resetValidators();
    addValidators();
  });

  useDidUpdateEffect(() => {
    // Em caso de mudança de preventValidate (o readOnly pode mudar) ou alguma propriedade relacionada aos validators
    // roda o processo novamente devem ser reinseridos, é muito mais fácil racionalizar assim do que tirar e inserir pontualmente
    resetErrors();
    resetValidators();
    addValidators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preventValidate, required, updateTriggerValue]);

  useWillUnmountEffect(() => {
    resetErrors();
    resetValidators();
  });
}
