import YiiLang from '~/phpgen/yii-lang';

import {hasValue} from '@/utils/helper';

import type {TCheckBoxCheckValue} from '@/components/formigo/types/checkOrRadio';

type TNoValueEmptyHiddenElementParams = {
  disabled?: boolean;
  initName: string;
  value?: unknown;
};

export const CHECK_BOOL_TRUE = '1';
export const CHECK_BOOL_FALSE = '0';

export function resolveCheckBoxValue(value: boolean | '0' | '1' | 0 | 1 | null | undefined) {
  if (!value) return CHECK_BOOL_FALSE; // null | undefined | false | ''
  if (value === true) return CHECK_BOOL_TRUE;
  if (value === 1) return CHECK_BOOL_TRUE;
  return value;
}

export function isCheckBoxChecked(value?: TCheckBoxCheckValue) {
  if (!value) return false;
  return !!Number(resolveCheckBoxValue(value));
}

export function getStringBoolOptions() {
  return [
    {id: 'Y', label: YiiLang.formigo('textYes')},
    {id: 'N', label: YiiLang.formigo('textNo')},
  ];
}

export function getIntegerBoolOptions() {
  return [
    {id: CHECK_BOOL_TRUE, label: YiiLang.formigo('textYes')},
    {id: CHECK_BOOL_FALSE, label: YiiLang.formigo('textNo')},
  ];
}

export function getNoValueHiddenElement(params: TNoValueEmptyHiddenElementParams) {
  const {disabled, initName, value} = params;
  if (hasValue(value)) return undefined;
  return (
    <input
      disabled={disabled}
      name={initName}
      type="hidden"
      value="" // não pode ser null ou undefined
    />
  );
}
