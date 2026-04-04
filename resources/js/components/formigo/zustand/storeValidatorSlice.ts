import {immerMutatorArrayAddItemAtEnd, immerMutatorSetValueIn, immerProduceState} from '@/utils/immerHelper';

import {attrValueGetter, getResolvedAttributeDashedKey, getResolvedDottedKey} from './helper';

import type {TZustandFormigoForms, TZustandFormigoValidatorState} from '@/components/formigo/zustand/types';
import type {StateCreator} from 'zustand';

type TZustandSliceState = TZustandFormigoValidatorState & {
  data: TZustandFormigoForms;
};

// @ts-expect-error zustand slice data não existe no slice
const zustandSlice: StateCreator<TZustandSliceState> = (set, get) => {
  return {
    dataValidatorAwarnessErrorsGetValue: (attribute, formId) =>
      get().data[formId].awarnessErrors?.[getResolvedAttributeDashedKey(attribute)],
    dataValidatorHasMessage: (formId) => {
      const formProxyState = get().data[formId];
      if (!formProxyState) return;
      const {serverErrors, submitErrors} = formProxyState;
      const serverErrorsCount = serverErrors ? Object.keys(serverErrors).length : 0;
      const submitErrorsCount = submitErrors ? Object.keys(submitErrors).length : 0;
      return serverErrorsCount + submitErrorsCount !== 0;
    },
    dataValidatorInputErrorsGetValue: (attribute, formId) => {
      const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
      const formProxyState = get().data[formId];
      if (!formProxyState) return;
      const {inputErrors, serverErrors} = formProxyState;
      return inputErrors?.[attributeDashedKey] || serverErrors?.[attributeDashedKey];
    },
    dataValidatorSubmitErrorsGetValue: (formId) => {
      const formProxyState = get().data[formId];
      return formProxyState.submitErrors;
    },
    inputAddValidator: (handler, attribute, formId) => {
      const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
      const validatorsKeyPath = getResolvedDottedKey(attributeDashedKey, 'validators');
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorArrayAddItemAtEnd(proxyState[formId], validatorsKeyPath, handler);
          }),
        };
      });
    },
    inputResetErrors: (attribute, formId) => {
      const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            const formProxyState = proxyState[formId];
            if (!formProxyState) return;
            delete formProxyState.awarnessErrors?.[attributeDashedKey];
            delete formProxyState.inputErrors?.[attributeDashedKey];
            delete formProxyState.serverErrors?.[attributeDashedKey];
            delete formProxyState.submitErrors?.[attributeDashedKey]; // Apaga pra facilitar a contagem no FormValidatorsMessage
          }),
        };
      });
    },
    inputResetValidators: (attribute, formId) => {
      const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            const formProxyState = proxyState[formId];
            if (!formProxyState) return;
            delete proxyState[formId].validators?.[attributeDashedKey];
          }),
        };
      });
    },
    inputSetServerErrors: (errors, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            Object.keys(errors).forEach((itemKey) => {
              const attributeDashedKey = itemKey.replaceAll('.', '__');
              immerMutatorSetValueIn(proxyState[formId], ['serverErrors', attributeDashedKey], errors[itemKey]);
            });
          }),
        };
      });
    },
    inputValidate: (attribute, formId) => {
      const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
      return set((prevState) => {
        const prevStateData = prevState.data;
        const formProxyState = prevStateData[formId];
        const inputValidators = formProxyState.validators?.[attributeDashedKey];
        if (!inputValidators) return prevState;
        const errorMessages = [] as Array<string>;
        const getAttrValue = attrValueGetter(formProxyState);
        inputValidators.forEach((validatorHandler) => {
          const errorMessage = validatorHandler(getAttrValue);
          if (errorMessage) errorMessages.push(errorMessage);
        });
        if (errorMessages.length === 0) return prevState;
        return {
          data: immerProduceState(prevStateData, (proxyState) => {
            immerMutatorSetValueIn(
              proxyState[formId],
              getResolvedDottedKey(attributeDashedKey, 'inputErrors'),
              errorMessages,
            );
          }),
        };
      });
    },
    submitValidate: (formId) => {
      return set((prevState) => {
        const prevStateData = prevState.data;
        const getAttrValue = attrValueGetter(prevStateData[formId]);
        return {
          data: immerProduceState(prevStateData, (proxyState) => {
            const formProxyState = proxyState[formId];
            // Limpar sempre a porra toda pra evitar efeitos colaterais
            // Para quando tem mais de um formulários na tela (baixa múltipla, modais que abrem por cima de outro form)
            // Por exemplo: se não resetar, e houver um erro no form de baixo, o modal vai considerar o erro e não vai permitir o envio
            // formProxyState.awarnessErrors = {}; Não reseta no submit, porque o check de ciência precisa estar na tela pro servidor entender que pode passar sem validar
            formProxyState.inputErrors = {};
            formProxyState.serverErrors = {};
            formProxyState.submitErrors = {};
            if (!formProxyState.validators) return;
            Object.keys(formProxyState.validators).forEach((attributeDashedKey) => {
              const inputValidators = formProxyState.validators?.[attributeDashedKey];
              if (inputValidators) {
                const errorMessages = [] as Array<string>;
                inputValidators.forEach((validatorHandler) => {
                  const errorMessage = validatorHandler(getAttrValue);
                  if (errorMessage) errorMessages.push(errorMessage);
                });
                if (errorMessages.length > 0) {
                  // submitErrors só é alimentado ao clicar no botão submit
                  // Não usa o inputErrors pro SubmitDecorator não ser "incomodado" antes de apertar o submit
                  immerMutatorSetValueIn(
                    formProxyState,
                    getResolvedDottedKey(attributeDashedKey, 'submitErrors'),
                    errorMessages,
                  );
                  // Também adiciona o inputErrors pra indicar os erros os campos
                  immerMutatorSetValueIn(
                    formProxyState,
                    getResolvedDottedKey(attributeDashedKey, 'inputErrors'),
                    errorMessages,
                  );
                }
              }
            });
          }),
        };
      });
    },
  };
};

export default zustandSlice;
