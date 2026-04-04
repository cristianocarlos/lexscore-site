import {getResolvedAttributeDashedKey, immerAttrGetValueIn} from './helper';

import type {TZustandFormigoForms, TZustandFormigoGetterState} from '@/components/formigo/zustand/types';
import type {StateCreator} from 'zustand';

type TZustandSliceState = TZustandFormigoGetterState & {
  data: TZustandFormigoForms;
};

// @ts-expect-error zustand slice data não existe no slice
const zustandSlice: StateCreator<TZustandSliceState> = (_set, get) => {
  return {
    // ##################
    // ## state.attr.* ##
    // ##################
    dataAttrGetValueIn: (attribute, formId) => {
      const formProxyState = get().data[formId];
      return immerAttrGetValueIn(formProxyState, attribute);
    },
    dataComboHasEmptyId: (attribute, formId) => {
      const dottedAttribute = typeof attribute === 'string' ? attribute : attribute.join('.');
      const formProxyState = get().data[formId];
      const id = immerAttrGetValueIn(formProxyState, dottedAttribute);
      const description = immerAttrGetValueIn(formProxyState, dottedAttribute + '_desc');
      return description && !id;
    },
    // #############
    // ## state.* ##
    // #############
    dataHandFillGetValue: (attribute, formId) => {
      const formProxyState = get().data[formId];
      return formProxyState.handFill?.[getResolvedAttributeDashedKey(attribute)];
    },
    dataInputDraftJsEditorStateGetValue: (attribute, formId) => {
      const formProxyState = get().data[formId];
      return formProxyState.inputDraftJsEditorState?.[getResolvedAttributeDashedKey(attribute)];
    },
    dataInputReadyGetValue: (attribute, formId) => {
      const formProxyState = get().data[formId];
      if (!formProxyState) return;
      return formProxyState.inputReady?.[getResolvedAttributeDashedKey(attribute)];
    },
    dataLoadingGetValue: (attribute, formId) => {
      const formProxyState = get().data[formId];
      return formProxyState.loading?.[getResolvedAttributeDashedKey(attribute)];
    },
  };
};

export default zustandSlice;
