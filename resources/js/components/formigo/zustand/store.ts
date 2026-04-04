import {create as zustandCreate} from 'zustand';

import {formigoLogger} from '@/utils/zustand/middlewares';
import storeCommonSlice from '@/utils/zustand/storeCommonSlice';

import storeGetterSlice from './storeGetterSlice';
import storeSetterSlice from './storeSetterSlice';
import storeValidatorSlice from './storeValidatorSlice';

import type {TZustandFormigoForms, TZustandFormigoState} from '@/components/formigo/zustand/types';

const initialData: TZustandFormigoForms = {};

export const useStore = zustandCreate<TZustandFormigoState>(
  formigoLogger((set, get, api) => {
    return {
      ...storeCommonSlice(initialData)(set, get, api),
      ...storeGetterSlice(set, get, api),
      ...storeSetterSlice(set, get, api),
      ...storeValidatorSlice(set, get, api),
    };
  }),
);

export const zustandFormigoGetData = () => useStore.getState().data;
export const zustandFormigoResetState = useStore.getState().dataReset;
export const zustandFormigoInputSetServerErrors = useStore.getState().inputSetServerErrors;
