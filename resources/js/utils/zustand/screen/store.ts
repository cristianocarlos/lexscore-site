import {create as zustandCreate} from 'zustand';

import {defaultLogger} from '@/utils/zustand/middlewares';
import storeCommonSlice from '@/utils/zustand/storeCommonSlice';

import type {
  TZustandScreenState,
  TZustandScreenStateData,
  TZustandScreenStateDataKeys,
} from '@/utils/zustand/types/screen';

const initialData: TZustandScreenStateData = {
  customBrowserTitles: undefined,
  feedbackData: undefined,
  idleFlag: undefined,
  menu: undefined,
  userPreferences: undefined,
};

export const useStore = zustandCreate<TZustandScreenState>(
  defaultLogger((set, get, api) => {
    return {
      ...storeCommonSlice(initialData)(set, get, api),
    };
  }),
);

export const zustandScreenGetData = () => useStore.getState().data;
export const zustandScreenResetState = useStore.getState().dataReset;
export const zustandScreenSetValue = (
  key: TZustandScreenStateDataKeys,
  value: TZustandScreenStateData[TZustandScreenStateDataKeys],
) => {
  useStore.getState().dataSetValue(value, key);
};
