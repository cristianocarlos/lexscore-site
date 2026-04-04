import type {TMenuResponse} from '@/auth/menu/types';
import type {TArrayKey} from '@/types/common';
import type {TZustandCommonState} from '@/utils/zustand/types/zustand';
import type {TUserPrefDataDTO} from '~/phpgen/types-dto';

export type TZustandScreenStateData = {
  customBrowserTitles?: Array<string>;
  feedbackData?: {
    response?: {data?: {message?: string}};
    success: boolean;
    message: string;
    timeout?: number;
  };
  idleFlag?: string;
  menu?: TMenuResponse;
  userPreferences?: TUserPrefDataDTO;
};

export type TZustandScreenState = {
  data: TZustandScreenStateData;
} & TZustandCommonState;

export type TZustandScreenStateDataKeys = keyof TZustandScreenStateData;
export type TZustandScreenCustomKeyPath = [TZustandScreenStateDataKeys, ...TArrayKey] | TZustandScreenStateDataKeys;

export type TZustandUserPreferencesStateData = NonNullable<TZustandScreenStateData['userPreferences']>;
