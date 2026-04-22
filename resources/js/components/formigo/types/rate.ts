import type {
  TCheckGroupOrRadioGroupOptionRows,
  TRadioCheckValue,
  TRadioGroupRefComponent,
} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {IPFormigoElementBase1} from '@/components/formigo/types/formigo';
import type {ReactElement, RefObject} from 'react';

export type TRateProps<GOptionData = TCheckGroupOrRadioGroupOptionRows[number]> = IPFormigoElementBase1 & {
  children?: ReactElement | Array<ReactElement>;
  handleChange?: (value?: TRadioCheckValue) => void; // handleChange adicional
  label: string;
  initValue?: TRadioCheckValue; // Valor inicial
  options: Array<GOptionData>; // Opções
  preventUncheck?: boolean; // Previne que seja desmarcado
  refComponent?: RefObject<TRadioGroupRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
};
