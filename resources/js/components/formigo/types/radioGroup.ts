import type {TCheckGroupOrRadioGroupComplementaryElements, TCheckGroupOrRadioGroupOptionRows} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {IPFormigoElementBase1, TFormigoRefComponent} from '@/components/formigo/types/formigo';
import type {ReactElement, RefObject} from 'react';

export type TRadioCheckValue = string;

export type TRadioGroupRefComponent = TFormigoRefComponent & {
  replaceValue: (value?: TRadioCheckValue) => void;
};

type TRadioGroupRefObject = RefObject<TRadioGroupRefComponent | undefined>;

export type TRadioGroupOptionRows = Array<{
  id: number | string;
  label?: ReactElement | string; // Não obrigatório, principalmente com uso do optionLabelFormatter
}>;

export type TRadioGroupProps<GOptionData = TRadioGroupOptionRows[number]> =
  IPFormigoElementBase1 & {
    disabledOptions?: Array<string>; // Id das opções desabilidatas
    label?: string | null; // Label
    pattern?: 'default' | 'filled' | 'inline'; //
    children?: ReactElement | Array<ReactElement>;
    handleChange?: (value?: TRadioCheckValue) => void; // handleChange adicional
    initValue?: TRadioCheckValue; // Valor inicial
    optionLabelFormatter?: (data: unknown) => ReactElement | string; // Formatter para o label de cada option
    preventUncheck?: boolean; // Previne que seja desmarcado
    refComponent?: TRadioGroupRefObject; // Expõe algumas funções do componente para uso externo
    title?: string;
    options: Array<GOptionData>; // Opções
    resolveComplementaryElements?: (params: {
      attribute: IPFormigoElementBase1['attribute'];
      disabled: IPFormigoElementBase1['disabled'];
      options: Array<unknown>;
      printMode: IPFormigoElementBase1['printMode'];
      refComponent?: TRadioGroupRefObject;
    }) => TCheckGroupOrRadioGroupComplementaryElements;
  };
