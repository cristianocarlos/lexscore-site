import {useCallback} from 'react';

import {resolveAttribute, useFormId} from '@/components/formigo/zustand/helper';

import {useStore} from './store';

import type {TFormigoAttribute, TFormigoValidatorHandler} from '@/components/formigo/types/formigo';

/**
 * selector
 */

export function useSelectorFormigoValidatorAwarnessErrors(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataValidatorAwarnessErrorsGetValue(attribute, formId));
}

export function useSelectorFormigoValidatorInputErrors(attribute: TFormigoAttribute) {
  const formId = useFormId();
  return useStore((state) => state.dataValidatorInputErrorsGetValue(attribute, formId));
}

export function useSelectorFormigoValidatorHasMessage() {
  const formId = useFormId();
  return useStore((state) => state.dataValidatorHasMessage(formId));
}

/**
 * store
 */

export function useStoreFormigoSubmitErrorsGetValue() {
  const formId = useFormId();
  return useCallback(() => {
    return useStore.getState().dataValidatorSubmitErrorsGetValue(formId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * setter
 */

export function useDispatchFormigoInputAddValidator(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.inputAddValidator);
  return useCallback(
    (handler: TFormigoValidatorHandler) => {
      fn(handler, attribute, formId);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

/**
 * @param {Array<string>} attribute
 */
export function useDispatchFormigoInputResetErrors(
  attribute: TFormigoAttribute | undefined,
): (cAttribute?: undefined) => void;
export function useDispatchFormigoInputResetErrors(attribute: null): (cAttribute: TFormigoAttribute) => void;
export function useDispatchFormigoInputResetErrors(attribute: TFormigoAttribute | null | undefined) {
  const formId = useFormId();
  const fn = useStore((state) => state.inputResetErrors);
  return useCallback(
    (cAttribute?: TFormigoAttribute | null) => {
      fn(resolveAttribute(cAttribute, attribute), formId);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useDispatchFormigoInputResetValidators(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.inputResetValidators);
  return useCallback(
    () => {
      fn(attribute, formId);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useDispatchFormigoInputValidate(attribute: TFormigoAttribute) {
  const formId = useFormId();
  const fn = useStore((state) => state.inputValidate);
  return useCallback(
    () => {
      fn(attribute, formId);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useDispatchFormigoSubmitValidate() {
  const formId = useFormId();
  const fn = useStore((state) => state.submitValidate);
  return useCallback(
    () => {
      fn(formId);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
