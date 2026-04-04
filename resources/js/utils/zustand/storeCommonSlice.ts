/* eslint-disable sort-keys */

import {immerGetValueIn, immerMutatorSetValueIn, immerProduceState} from '@/utils/immerHelper';

import type {TZustandCommonState} from '@/utils/zustand/types/zustand';
import type {StateCreator} from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TZustandSliceState = TZustandCommonState & {data: any};

function zustanSliceWrapper<G>(initialData: G, resolveInjectedData?: TZustandCommonState['dataInject']) {
  const zustanSlice: StateCreator<TZustandSliceState> = (set, get) => {
    return {
      data: initialData,
      //
      dataInject: (newData, resetMethod) =>
        set(() => {
          const resolvedInjectedData =
            typeof resolveInjectedData === 'function' ? resolveInjectedData(newData) : newData;
          let resolvedData;
          switch (resetMethod) {
            case 'none':
              resolvedData = get().data;
              break;
            case 'init': {
              // O feedback de sucesso não deve resetar entre telas
              if (
                Object.prototype.hasOwnProperty.call(initialData, 'feedback') &&
                get().data.feedback?.type === 'success'
              ) {
                // @ts-expect-error property does not exists on type G
                delete initialData.feedback;
              }
              resolvedData = {...get().data, ...initialData};
              break;
            }
            default:
              resolvedData = get().data;
          }
          return {data: {...resolvedData, ...resolvedInjectedData}};
        }),
      dataReset: () => set(() => ({data: initialData})),
      //
      dataGetValue: (propName) => {
        return get().data?.[propName];
      },
      dataSetValue: (value, propName) => {
        return set((prevState) => {
          return {
            data: immerProduceState(prevState.data, (proxyState) => {
              if (!Object.hasOwn(proxyState, propName)) throw new Error('Propriedade não inicializada: ' + propName);
              proxyState[propName] = value;
            }),
          };
        });
      },
      //
      dataGetValueIn: (keyPath) => immerGetValueIn(get().data, keyPath),
      dataSetValueIn: (value, keyPath) => {
        return set((prevState) => {
          return {
            data: immerProduceState(prevState.data, (proxyState) => {
              immerMutatorSetValueIn(proxyState, keyPath, value);
            }),
          };
        });
      },
    };
  };
  return zustanSlice;
}

export default zustanSliceWrapper;
