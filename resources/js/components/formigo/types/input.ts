import type {TVerticalClockBookingDataLoad} from '@/components/formigo/calendar/types';
import type {
  IPFormigoElementBase1,
  IPFormigoElementBase2,
  TFormigoRefComponent,
  TFormigoAttribute,
} from '@/components/formigo/types/formigo';
import type {
  TFormattedDate,
  TFormattedDateHour,
  TInputKeyboardEventHandler,
  TInputOrTextAreaFocusEventHandler,
} from '@/types/common';
import type {RefObject} from 'react';
import type {TSvgMapNames} from '~/phpgen/yii-svg-map';

export type TInputRefHtmlButton = RefObject<HTMLButtonElement | null>;

export type TInputRefComponent = TFormigoRefComponent & {
  inputFocus: (focusOptions?: FocusOptions) => void; // Focar no input
  replaceValue: (value?: string) => void;
};

export type IPHidden<GAttrValue = string | undefined> = {
  attribute: TFormigoAttribute;
  dataType?: 'check-group-descriptions' | 'check-group-values' | 'json-value' | 'suggest-select-option-id'; // quando é necessário identificar otipo de dado que vai no hidden
  disabled?: boolean;
  resolver?: (attrValue?: GAttrValue) => string | undefined; // As vezes é necessário tratar o valor quando usa o draftjs
  value?: string;
};

export type IPInputBase = IPFormigoElementBase1 &
  IPFormigoElementBase2 & {
    autoComplete?: 'off' | 'new-password'; // Atributo autoComplete
    dataType?: 'skip-url-query-string'; // Identificação adicional (ex. skip-url-query-string)
    handleBlur?: (value?: string) => void; // handle adicional
    handleFocus?: TInputOrTextAreaFocusEventHandler; // handle adicional
    iconName?: TSvgMapNames; // Nome do ícone
    initValue?: string; // Valor inicial
    refComponent?: RefObject<TInputRefComponent | undefined>; // Expõe algumas funções do componente para uso externo
    refHtmlInput?: RefObject<HTMLInputElement | null>; // Expõe o elemento input
  };

export type IPTextInput = IPInputBase & {
  handleKeyDown?: TInputKeyboardEventHandler; // handle adicional
  handleKeyUp?: TInputKeyboardEventHandler; // handle key up (quick search)
};

export type IPTextArea = Omit<IPInputBase, 'autoComplete' | 'dataType' | 'refHtmlInput'> & {
  refHtmlTextArea?: RefObject<HTMLTextAreaElement | null>; // Expõe o elemento input
};

export type IPFloatInput = IPInputBase & {
  allowNegative?: boolean;
};

export type IPIntegerInput = IPInputBase & {
  allowNegative?: boolean; // Permite números negativos
};

export type IPDateInput = IPInputBase & {
  handlePick?: (value: TFormattedDate) => void; // handle pick adicional
  hasAgeDesc?: boolean; // Se apresenta a descrição da data
  hasPicker?: boolean; // Se tem um picker
  pickerPosition?: 'left' | 'right'; // Posição do picker
  resetValueOnPick?: boolean; // Reseta o valor do campo logo após o pick
};

export type IPDateHourInput = IPInputBase & {
  bookingDataLoad?: TVerticalClockBookingDataLoad; // Carrega expediente e agendamentos
  handlePick?: (value: TFormattedDateHour) => void; // handle pick adicional
  hasPicker?: IPDateInput['hasPicker'];
  pickerPosition?: IPDateInput['pickerPosition'];
  resetValueOnPick?: IPDateInput['resetValueOnPick'];
};

export type IPPhoneInput = IPInputBase & {
  countryDataAttribute?: TFormigoAttribute;
};

export type IPZipCodeInput = Omit<IPInputBase, 'validators'> & {
  handleSearch: (value?: string) => void; // handle search
  handleSearchCancel: () => void; // handle search cancel
};

export type IPPasswordInput = Omit<IPInputBase, 'printMode' | 'datatype'> & {
  allowSavingCredentials?: boolean; // Previne o navegador de salvar login e senha
  hasStrenghtMeter?: boolean; // Se tem medidor de força de senha
};

export type IPEmailInput = IPInputBase;
export type IPCpfInput = IPInputBase;
export type IPCnpjInput = IPInputBase;
export type IPCurrencyInput = IPInputBase;
export type IPHourInput = IPInputBase;
