import type {TCheckGroupCheckValue} from '@/components/formigo/types/checkOrRadio';
import type {IPFormigoElementBase1, TFormigoAttribute, TFormigoRefComponent} from '@/components/formigo/types/formigo';
import type {ReactElement, RefObject} from 'react';

export type TCheckGroupOrRadioGroupOptionRows = Array<{
  id: number | string;
  label?: ReactElement | string; // Não obrigatório, principalmente com uso do optionLabelFormatter
}>;

export type TCheckGroupOrRadioGroupComplementaryElements = {[checkOrRadioValue: string]: ReactElement};

type TCheckOrRadioResolveComplementaryElements<GOptionData> = {
  attribute: IPFormigoElementBase1['attribute'];
  disabled: IPFormigoElementBase1['disabled'];
  options: Array<GOptionData>;
  printMode: IPFormigoElementBase1['printMode'] | IPCheckGroup['printMode'];
  refComponent: IPRadioGroup['refComponent'] | IPCheckGroup['refComponent'];
};

type IPCheckGroupOrRadioGroupOptions<GOptionData> = {
  optionLabelFormatter?: (data: GOptionData) => ReactElement | string; // Formatter para o label de cada option
  options: Array<GOptionData>; // Opções
  resolveComplementaryElements?: (
    params: TCheckOrRadioResolveComplementaryElements<GOptionData>,
  ) => TCheckGroupOrRadioGroupComplementaryElements; // Campos para preenchimento de informações complementares relativos a opção {1: element, 2: element}
};

/**
 *
 */

type TCheckGroupChangedData = {
  checkedValues?: TCheckGroupValue;
  checkValue: TCheckGroupCheckValue;
  isChecked: boolean;
};

export type TCheckGroupValue = {[checkValue: string]: TCheckGroupCheckValue};

export type TCheckGroupRefComponent = TFormigoRefComponent & {
  changeState: (checkValue: TCheckGroupCheckValue, isChecked: boolean) => void; // Marcar/desmarcar item
  checkAll: () => void; // Marcar todos
  replaceValue: (value?: TCheckGroupValue) => void;
};

type IPCheckGroupOrRadioGroupBase = IPFormigoElementBase1 & {
  disabledOptions?: Array<string>; // Id das opções desabilidatas
  label?: string | null; // Label
  pattern?: 'default' | 'filled' | 'inline'; //
};

export type IPCheckGroup<GOptionData = TCheckGroupOrRadioGroupOptionRows[number]> = IPCheckGroupOrRadioGroupBase &
  IPCheckGroupOrRadioGroupOptions<GOptionData> & {
    descriptionsAttribute?: TFormigoAttribute; // Labels via hidden json
    handleChange?: (changedData: TCheckGroupChangedData) => void; // handleChange adicional
    hiddenOptions?: Array<string>; // Id das opções ocultas na tela
    initValue?: TCheckGroupValue; // Valor inicial {"1": "1", "2": "2"}
    maxSize?: number; // Validator
    minSize?: number; // Validator
    readOnlyOptions?: Array<string>; // Id das opções reandOnly
    refComponent?: RefObject<TCheckGroupRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
    valuesAttribute?: TFormigoAttribute; // Flat values via hidden json (ex.: query strings de busca)
  };
