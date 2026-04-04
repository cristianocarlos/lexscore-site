import type {ARIA_AUTO_COMPLETE} from '@/components/formigo/combo-or-suggest/helper';
import type {TArrayKey} from '@/types/common';
import type {MASKS} from '@/utils/masks';
import type {ReactElement} from 'react';

export type TFormigoAttribute = Array<string>;

export type TFormigoLabel = ReactElement | string | null;
export type TFormigoSanitizedValues = {[p: string]: string | Record<string, string | undefined> | undefined};

export type TFormigoValidatorGetAttrValue = <G = string>(attribute: TFormigoAttribute) => G | undefined;

export type TFormigoValidatorBaseCallerProps = {
  attribute: TFormigoAttribute;
};

export type TFormigoRefComponent = {
  resetError: () => void; // Resetar erro(s)
  resetValue: () => void; // Resetar valor
};

export type TFormigoValidatorHandler = (getAttrValue: TFormigoValidatorGetAttrValue) => string | null;

export type IPFormigoElementBase1 = {
  // Todos
  attribute: TFormigoAttribute;
  className?: string; // HTML Atributo class
  disabled?: boolean; // HTML Atributo disabled (não envia o valor)
  forceValidateOnSubmit?: boolean; // Se deve validar mesmo com readOnly ao enviar
  printMode?: boolean; // Não tem no draftjs
  readOnly?: boolean; // HTML Atributo readOnly (com hidden para enviar o valor)
  required?: boolean; // Validator
  validateOnlyOnSubmit?: boolean; // Se deve validar somente ao enviar
  validators?: Array<TFormigoValidatorHandler>; // Validators adicionais
};

export type IPFormigoElementBase2 = {
  label?: string | null; // Label
  labelHint?: string; // Label complementar
  maxLength?: number; // Atributo maxLength (ComboOrSuggest: as vezes é necessário usar o que o usuário escreve, sem seleção, então precisa limitar o tamanho. Nunca será o atributo do DB, que é o id. Ex Universidades)
  placeholder?: string; // Atributo placeholder
};

export type TFormigoMasks = keyof typeof MASKS;

export type TAriaHtmlProps = {
  ariaActiveDescendantId?: string;
  ariaAutoComplete?: keyof typeof ARIA_AUTO_COMPLETE;
  ariaOwnsId?: string;
};

export type TAutoSaveStatePaths = Array<TArrayKey>;

export type TFormigoInputErrors = Array<string>;
export type TFormigoSubmitErrors = {[attributeDashedKey: string]: Array<string>};
export type TFormigoServerErrors = {[attributeDashedKey: string]: Array<string>};

export type TFormigoRequestMethod = 'patch' | 'post' | 'put';

export type TFormigoFormFeatures = {recordId: number | null; values: Record<string, unknown>};
