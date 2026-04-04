import type {IPFormigoElementBase1, TFormigoRefComponent, TFormigoLabel} from '@/components/formigo/types/formigo';
import type {RefObject} from 'react';

export type TCheckAnyValue = string; // CheckBox / SwitchCheck / CheckGroup
export type TCheckGroupCheckValue = string;
export type TCheckBoxCheckValue = '0' | '1';

type TCheckBoxChangedData = {checkValue: TCheckAnyValue; isChecked: boolean};

export type TCheckBoxRefComponent = TFormigoRefComponent & {
  replaceValue: (value: boolean) => void;
};

export type IPCheckBox = IPFormigoElementBase1 & {
  checkValue?: TCheckBoxCheckValue; // Atributo value
  handleChange?: (changedData: TCheckBoxChangedData) => void; // handleChange adicional
  initValue?: TCheckBoxCheckValue; // Valor inicial
  label?: TFormigoLabel;
  refComponent?: RefObject<TCheckBoxRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
  uncheckValue?: TCheckBoxCheckValue; // Valor unchecked (para o hidden)
};
