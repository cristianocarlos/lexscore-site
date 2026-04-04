import {useCommonDispatchSetValue, useCommonSelectorValue} from '@/utils/zustand/hooksCommon';

import {useStore} from './store';

import type {
  TZustandScreenCustomKeyPath,
  TZustandScreenStateData,
  TZustandScreenStateDataKeys,
  TZustandUserPreferencesStateData,
} from '@/utils/zustand/types/screen';
import type {TCommonKeyPathSetValue, TCommonSetValue} from '@/utils/zustand/types/zustand';

export function useDispatchScreenSetValue<KeyName extends TZustandScreenStateDataKeys>(
  keyPath: KeyName | undefined,
): TCommonSetValue<TZustandScreenStateData[KeyName]>;
export function useDispatchScreenSetValue<GType>(
  keyPath: TZustandScreenCustomKeyPath | undefined,
): TCommonSetValue<GType>;
export function useDispatchScreenSetValue<GType>(keyPath: null): TCommonKeyPathSetValue<GType>;
export function useDispatchScreenSetValue(keyPath: TZustandScreenCustomKeyPath | null | undefined) {
  return useCommonDispatchSetValue(useStore, keyPath);
}

export function useSelectorScreenValue<KeyName extends TZustandScreenStateDataKeys>(
  keyPath: KeyName,
): TZustandScreenStateData[KeyName];
export function useSelectorScreenValue<GType>(keyPath: TZustandScreenCustomKeyPath): GType;
export function useSelectorScreenValue(keyPath: TZustandScreenCustomKeyPath) {
  return useCommonSelectorValue(useStore, keyPath);
}

export function useSelectorScreenUserPreferenceValue<KeyName extends keyof TZustandUserPreferencesStateData>(
  keyName: KeyName,
) {
  return useCommonSelectorValue(useStore, ['userPreferences', keyName]) as TZustandUserPreferencesStateData[KeyName];
}
