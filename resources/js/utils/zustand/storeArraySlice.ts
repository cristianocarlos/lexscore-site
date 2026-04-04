import {
  immerMutatorArrayAddItemAtBeginning,
  immerMutatorArrayMergeValue,
  immerMutatorArrayRemoveItem,
  immerProduceState,
} from '@/utils/immerHelper';

import type {TZustandArrayState} from '@/utils/zustand/types/zustand';
import type {StateCreator} from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TZustandSliceState = TZustandArrayState & {data?: any};

const zustandSlice: StateCreator<TZustandSliceState> = (set) => {
  return {
    dataArrayAddItemAtBeginning: (itemValue, keyPath) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorArrayAddItemAtBeginning(proxyState, keyPath, itemValue);
          }),
        };
      });
    },
    dataArrayMergeValueIn: (mergeableRows, keyPath) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorArrayMergeValue(proxyState, keyPath, mergeableRows);
          }),
        };
      });
    },
    dataArrayRemoveItem: (index, keyPath) => {
      return set((prevState) => {
        return {
          data: immerProduceState(prevState.data, (proxyState) => {
            immerMutatorArrayRemoveItem(proxyState, keyPath, index);
          }),
        };
      });
    },
  };
};

export default zustandSlice;
