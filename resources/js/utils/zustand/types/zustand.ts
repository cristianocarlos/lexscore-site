import type {TArrayKey} from '@/types/common';
import type {StoreApi, UseBoundStore} from 'zustand';

export type TCommonSetValue<G> = (newValue: G | undefined, cKeyPath?: undefined) => void;
export type TCommonKeyPathSetValue<G> = (newValue: G | undefined, cKeyPath: TArrayKey) => void;
//
export type TCommonArrayAddItem<G> = (itemValue: G, cKeyPath?: undefined) => void;
export type TCommonKeyPathArrayAddItem<G> = (itemValue: G, cKeyPath: TArrayKey) => void;
//
export type TCommonArrayMergeValue<G> = (mergeableArray: G, cKeyPath?: undefined) => void;
export type TCommonKeyPathArrayMergeValue<G> = (mergeableArray: G, cKeyPath: TArrayKey) => void;
//
export type TCommonObjectAddItem<G> = (itemValue: G, itemKey: string, cKeyPath?: undefined) => void;
export type TCommonKeyPathObjectAddItem<G> = (itemValue: G, itemKey: string, cKeyPath: TArrayKey) => void;
//
export type TCommonObjectMergeValue<G> = (mergeableData: G, cKeyPath?: undefined) => void;
export type TCommonKeyPathObjectMergeValue<G> = (mergeableData: G, cKeyPath: TArrayKey) => void;
//
export type TCommonObjectRemoveItem = (itemKey: string, cKeyPath?: undefined) => void;
export type TCommonKeyPathObjectRemoveItem = (itemKey: string, cKeyPath: TArrayKey) => void;

export type TZustandCommonState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataInject: (initialData: any, resetMethod?: 'init' | 'none') => void;
  dataReset: () => void;
  dataGetValue: (propName: string) => unknown;
  dataSetValue: <G>(value: G, propName: string) => void;
  dataGetValueIn: (keyPath: TArrayKey | string) => unknown;
  dataSetValueIn: <G>(newValue: G, keyPath: TArrayKey | string) => void;
};

export type TZustandObjectState = {
  dataObjectAddItem: <G>(itemValue: G, itemKey: string, keyPath: TArrayKey | string) => void;
  dataObjectMergeValueIn: <G>(mergeableData: G, keyPath: TArrayKey | string) => void;
  dataObjectRemoveItem: (itemKey: string, keyPath: TArrayKey | string) => void;
};

export type TZustandArrayState = {
  dataArrayAddItemAtBeginning: <G>(itemValue: G, keyPath: TArrayKey | string) => void;
  dataArrayMergeValueIn: <G>(mergeableRows: G, keyPath: TArrayKey | string) => void;
  dataArrayRemoveItem: (index: number, keyPath: TArrayKey | string) => void;
};

export type TZustandMergeableArray = Array<unknown>;
export type TZustandMergeableObject = {[p: string]: unknown};

export type TZustandCommonUseStore = UseBoundStore<StoreApi<TZustandCommonState>>;
export type TZustandObjectUseStore = UseBoundStore<StoreApi<TZustandObjectState>>;
export type TZustandArrayUseStore = UseBoundStore<StoreApi<TZustandArrayState>>;
