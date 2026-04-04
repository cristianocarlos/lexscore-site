import {
  immerMutatorObjectAddItem,
  immerMutatorObjectMergeValue,
  immerMutatorObjectRemoveItem,
  immerProduceState,
} from '@/utils/immerHelper';

import type {TZustandObjectState} from '@/utils/zustand/types/zustand';
import type {StateCreator} from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TZustandSliceState = TZustandObjectState & {data?: any};

const zustandSlice: StateCreator<TZustandSliceState> = (set) => {
  return {
    dataObjectAddItem: (itemValue, itemKey, keyPath) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorObjectAddItem(proxyState, keyPath, itemKey, itemValue);
          }),
        };
      });
    },
    dataObjectMergeValueIn: (mergeableData, keyPath) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorObjectMergeValue(proxyState, keyPath, mergeableData);
          }),
        };
      });
    },
    dataObjectRemoveItem: (itemKey, keyPath) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorObjectRemoveItem(proxyState, keyPath, itemKey);
          }),
        };
      });
    },
  };
};

export default zustandSlice;
