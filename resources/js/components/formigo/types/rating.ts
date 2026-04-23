import type {TCheckGroupOrRadioGroupOptionRows} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {IPFormigoElementBase1} from '@/components/formigo/types/formigo';
import type {TRadioCheckValue, TRadioGroupRefComponent} from '@/components/formigo/types/radioGroup';
import type {ReactElement, RefObject} from 'react';

export type TRatingProps<GOptionData = TCheckGroupOrRadioGroupOptionRows[number]> = IPFormigoElementBase1 & {
  children?: ReactElement | Array<ReactElement>;
  handleChange?: (value?: TRadioCheckValue) => void; // handleChange adicional
  label?: string | null;
  initValue?: TRadioCheckValue; // Valor inicial
  options: Array<GOptionData>; // Opções
  preventUncheck?: boolean; // Previne que seja desmarcado
  refComponent?: RefObject<TRadioGroupRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
};
