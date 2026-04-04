import {useCallback, useRef} from 'react';

import type {TArrayKey} from '@/types/common';
import type {
  TZustandArrayUseStore,
  TZustandCommonUseStore,
  TZustandObjectUseStore,
} from '@/utils/zustand/types/zustand';

/**
 * dispatch array
 */

export function useCommonDispatchArrayAddItemAtBeginning<G>(
  useStore: TZustandArrayUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataArrayAddItemAtBeginning<G>);
  return useCallback(
    (itemValue: G, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(itemValue, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useCommonDispatchArrayMergeValue<G>(
  useStore: TZustandArrayUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataArrayMergeValueIn<G>);
  return useCallback(
    (mergeableArray: G, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(mergeableArray, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useCommonDispatchArrayRemoveItem(
  useStore: TZustandArrayUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataArrayRemoveItem);
  return useCallback(
    (index: number, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(index, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

/**
 * dispatch object
 */

export function useCommonDispatchObjectAddItem<G>(
  useStore: TZustandObjectUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataObjectAddItem<G>);
  return useCallback(
    (itemValue: G, itemKey: string, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(itemValue, itemKey, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useCommonDispatchObjectMergeValue<G>(
  useStore: TZustandObjectUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataObjectMergeValueIn<G>);
  return useCallback(
    (mergeableData: G, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(mergeableData, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useCommonDispatchObjectRemoveItem(
  useStore: TZustandObjectUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataObjectRemoveItem);
  return useCallback(
    (itemKey: string, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(itemKey, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

/**
 * dispatch
 */

export function useCommonDispatchSetValue<G>(
  useStore: TZustandCommonUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  const fn = useStore((state) => state.dataSetValueIn<G | undefined>);
  return useCallback(
    (newValue: G | undefined, cKeyPath?: TArrayKey) => {
      const resolvedKeyPath = cKeyPath || keyPath;
      if (resolvedKeyPath) fn(newValue, resolvedKeyPath);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
}

/**
 * init: valor inicial, nunca muda
 * Casos de uso:
 * - resetar para o valor inicial
 * - checar se houve mudança
 */

export function useCommonInitValue(useStore: TZustandCommonUseStore, keyPath: TArrayKey | string | null | undefined) {
  const value = keyPath ? useStore.getState().dataGetValueIn(keyPath) : undefined;
  return useRef(value).current;
}

/**
 * selector
 */

export function useCommonSelectorValue(
  useStore: TZustandCommonUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  return useStore((state) => {
    if (!keyPath) return undefined;
    return state.dataGetValueIn(keyPath);
  });
}

/**
 * store
 */

export function useCommonStoreGetValue(
  useStore: TZustandCommonUseStore,
  keyPath: TArrayKey | string | null | undefined,
) {
  return useCallback(() => {
    if (!keyPath) return undefined;
    return useStore.getState().dataGetValueIn(keyPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
