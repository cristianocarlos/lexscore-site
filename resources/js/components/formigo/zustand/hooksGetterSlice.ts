import {useCallback, useRef} from 'react';

import {useFormId} from '@/components/formigo/zustand/helper';
import {getArrayLength} from '@/utils/zustand/selectors';

import {useStore} from './store';

import type {TFormigoAttribute} from '@/components/formigo/types/formigo';
import type {TDraftJsEditorState} from '@/types/thirdParty';

/**
 * init: valor inicial, nunca muda
 * Casos de uso:
 * - resetar para o valor inicial
 * - checar se houve mudança
 */

export function useInitFormigoAttrValue<G = string>(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useRef(useStore.getState().dataAttrGetValueIn(attribute, formId)).current as G | undefined;
}

/**
 * selector: monitoramento do valor em tempo real
 */

export function useSelectorFormigoAttrValue<G = string>(attribute: TFormigoAttribute | undefined) {
  const formId = useFormId();
  return useStore((state) => {
    if (!attribute) return undefined;
    return state.dataAttrGetValueIn(attribute, formId) as G | undefined;
  });
}

export function useSelectorFormigoHandFillValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataHandFillGetValue(attribute, formId));
}

export function useSelectorFormigoInputReadyValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataInputReadyGetValue(attribute, formId));
}

export function useSelectorFormigoInputDraftJsEditorState(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataInputDraftJsEditorStateGetValue(attribute, formId));
}

export function useSelectorFormigoLoadingValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataLoadingGetValue(attribute, formId));
}

/**
 * store: método para obter o valor, não gera rerender
 * Casos de uso:
 * - acessar o valor atual através de um evento (click, fetch, ...)
 */

export function useStoreFormigoAttrGetValue<G = string>(attribute: TFormigoAttribute | undefined) {
  const formId = useFormId();
  return useCallback(() => {
    if (!attribute) return undefined;
    return useStore.getState().dataAttrGetValueIn(attribute, formId) as G | undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useStoreFormigoDraftJsEditorStateGetValue(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useCallback(() => {
    return useStore.getState().dataInputDraftJsEditorStateGetValue(attribute, formId) as TDraftJsEditorState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * helper
 */

export function useSelectorFormigoAttrArrayLength(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => {
    return getArrayLength(state.dataAttrGetValueIn(attribute, formId));
  });
}

export function useSelectorFormigoComboHasEmptyId(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataComboHasEmptyId(attribute, formId));
}

export function useSelectorFormigoFeedback() {
  return useStore((state) => state.data.feedback);
}

export function useSelectorFormigoState() {
  return useStore((state) => state);
}

export const useCustomFormigoState = useStore;
