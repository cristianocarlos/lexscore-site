import {get as esToolkitGet} from 'es-toolkit/compat';

import {useFormigoContextFormId} from '@/components/formigo/utils/withContext';
import {immerMutatorSetValueIn} from '@/utils/immerHelper';

import type {TFormigoAttribute} from '@/components/formigo/types/formigo';
import type {TZustandFormigoFormProxyState} from '@/components/formigo/zustand/types';
import type {TDottedKey, TArrayKey} from '@/types/common';
import type {TDraftJsEditorState} from '@/types/thirdParty';

export function getResolvedDottedKey(keyPath: TArrayKey | TDottedKey, prefixKey?: keyof TZustandFormigoFormProxyState) {
  if (typeof keyPath === 'string') {
    if (prefixKey) return prefixKey + '.' + keyPath;
    return keyPath;
  }
  if (Array.isArray(keyPath)) {
    const dottedKey = keyPath.join('.');
    if (prefixKey) return prefixKey + '.' + dottedKey;
    return dottedKey;
  }
  return keyPath;
}

export function getResolvedAttributeDashedKey(keyPath: TArrayKey) {
  return getResolvedDottedKey(keyPath).replaceAll('.', '__');
}

export function attrValueGetter(prevFormProxyState: TZustandFormigoFormProxyState) {
  return (unresolvedKeyPath: TArrayKey) => {
    return immerAttrGetValueIn(prevFormProxyState, unresolvedKeyPath);
  };
}

export function immerAttrGetValueIn(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TFormigoAttribute | TDottedKey,
) {
  if (!formProxyState) return;
  return esToolkitGet(formProxyState.attr, attribute);
}

export function immerMutatorAttrSetValueIn<G = string | undefined>(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TFormigoAttribute,
  value: G,
) {
  if (!formProxyState) return;
  immerMutatorSetValueIn(formProxyState.attr, attribute, value);
}

export function immerMutatorInputDraftJsEditorStateSetValue(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TFormigoAttribute,
  editorState: TDraftJsEditorState,
) {
  const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
  const keyPath = getResolvedDottedKey(attributeDashedKey, 'inputDraftJsEditorState');
  immerMutatorSetValueIn(formProxyState, keyPath, editorState);
}

export function immerMutatorInputReadySetValue(
  formProxyState: TZustandFormigoFormProxyState,
  attribute: TFormigoAttribute,
  value = true,
) {
  const attributeDashedKey = getResolvedAttributeDashedKey(attribute);
  const keyPath = getResolvedDottedKey(attributeDashedKey, 'inputReady');
  immerMutatorSetValueIn(formProxyState, keyPath, value);
}

/**
 * Obtém o caminho de um objeto aninhado em dotted notation
 * {eu: {nao: {sei: 'o que to fazendo'}}} > eu.nao.sei
 * Era usado pra obter os custom errors, mas agora eles já vem dotted notation do servidor
 */
export function nestedObjectKeyify(objectValue: unknown, accumulator: Array<unknown> = []): string {
  if (!Array.isArray(objectValue) && Object(objectValue) === objectValue) {
    // @ts-expect-error não faço idéia de como tipar
    return Object.entries(objectValue).flatMap(([itemKey, itemValue]) => {
      return nestedObjectKeyify(itemValue, [...accumulator, itemKey]);
    });
  }
  return accumulator.join('.');
}

export function useFormId() {
  const formId = useFormigoContextFormId();
  if (!formId) throw new Error('FormId must be provided');
  return formId;
}

export function resolveAttribute(
  callbackAttribute: TFormigoAttribute | undefined | null,
  hookAttribute: TFormigoAttribute | undefined | null,
) {
  const attribute = callbackAttribute || hookAttribute;
  if (!attribute) throw new Error('attribute must be provided');
  return attribute;
}
