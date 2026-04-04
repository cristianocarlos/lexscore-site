import {hasValue} from '@/utils/helper';
import {
  immerMutatorArrayAddItemAtEnd,
  immerMutatorArrayRemoveItem,
  immerMutatorObjectMergeValue,
  immerProduceState,
} from '@/utils/immerHelper';

import {
  getResolvedAttributeDashedKey,
  getResolvedDottedKey,
  immerAttrGetValueIn,
  immerMutatorAttrSetValueIn,
  immerMutatorInputReadySetValue,
} from './helper';
import {formatEnteredValue, formatValue} from './masks';

import type {TZustandFormigoForms, TZustandFormigoSetterState} from '@/components/formigo/zustand/types';
import type {StateCreator} from 'zustand';

type TZustandSliceState = TZustandFormigoSetterState & {data: TZustandFormigoForms};

// @ts-expect-error zustand slice data não existe no slice
const zustandSlice: StateCreator<TZustandSliceState> = (set) => {
  return {
    // ##################
    // ## state.attr.* ##
    // ##################
    dataAttrArrayAddItem: (itemValue, attribute, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorArrayAddItemAtEnd(proxyState[formId], getResolvedDottedKey(attribute, 'attr'), itemValue);
          }),
        };
      });
    },
    dataAttrArrayRemoveItem: (index, attribute, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorArrayRemoveItem(proxyState[formId], getResolvedDottedKey(attribute, 'attr'), index);
          }),
        };
      });
    },
    dataAttrObjectMergeValue: (mergeableData, attribute, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorObjectMergeValue(proxyState[formId], getResolvedDottedKey(attribute, 'attr'), mergeableData);
          }),
        };
      });
    },
    dataAttrSetValueIn: (value, attribute, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorAttrSetValueIn(proxyState[formId], attribute, value);
          }),
        };
      });
    },
    // #############
    // ## state.* ##
    // #############
    dataHandFillSetValue: (value, attribute, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            const formProxyState = proxyState[formId];
            if (!formProxyState.handFill) formProxyState.handFill = {};
            formProxyState.handFill[getResolvedAttributeDashedKey(attribute)] = value;
          }),
        };
      });
    },
    dataLoadingSetValue: (value, attribute, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            const formProxyState = proxyState[formId];
            if (!formProxyState.loading) formProxyState.loading = {};
            formProxyState.loading[getResolvedAttributeDashedKey(attribute)] = value;
          }),
        };
      });
    },
    inputMask: (attribute, mask, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            const formProxyState = proxyState[formId];
            const attrValue = immerAttrGetValueIn(formProxyState, attribute);
            if (attrValue) {
              const maskedValue = formatEnteredValue(mask, attrValue);
              if (maskedValue) {
                immerMutatorAttrSetValueIn(formProxyState, attribute, maskedValue);
              }
            }
          }),
        };
      });
    },
    inputPrepare: (attribute, initValue, mask, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            const formProxyState = proxyState[formId];
            const currentValue = immerAttrGetValueIn(formProxyState, attribute);
            if (mask) {
              const resolvedValue = currentValue || initValue;
              if (resolvedValue) {
                immerMutatorAttrSetValueIn(formProxyState, attribute, formatValue(mask, resolvedValue));
              }
              // } else if (hasValue(initValue) && currentValue !== initValue) { não faça isso seu burro
            } else if (!hasValue(currentValue) && hasValue(initValue)) {
              immerMutatorAttrSetValueIn(formProxyState, attribute, initValue);
            }
            immerMutatorInputReadySetValue(formProxyState, attribute, true);
          }),
        };
      });
    },
    produceFormState: (cb, formId) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            cb(proxyState[formId], {
              attrGetValueIn: immerAttrGetValueIn,
              mutatorAttrSetValueIn: immerMutatorAttrSetValueIn,
              mutatorInputReadySetValue: immerMutatorInputReadySetValue,
            });
          }),
        };
      });
    },
    produceStoreState: (cb) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            cb(proxyState, {
              attrGetValueIn: immerAttrGetValueIn,
              mutatorAttrSetValueIn: immerMutatorAttrSetValueIn,
              mutatorInputReadySetValue: immerMutatorInputReadySetValue,
            });
          }),
        };
      });
    },
  };
};

export default zustandSlice;
