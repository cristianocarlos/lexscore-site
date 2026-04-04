import type {TsAllToString, TsOverride} from '@/types/helper';
import type {
  ChangeEventHandler,
  ClipboardEventHandler,
  DragEventHandler,
  FormEvent,
  FocusEvent,
  FocusEventHandler,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  SyntheticEvent,
  TouchEventHandler,
} from 'react';
import type {TDBValue} from '~/phpgen/types-db-schema';
import type {TCountryDTO, TPhoneDTO} from '~/phpgen/types-dto';

export type TEnhancedFormEvent<G> = FormEvent<G> & {
  data?: string;
  key?: string;
};

export type TEnhancedKeyboardEvent<G> = KeyboardEvent<G> & {
  keyCode: number;
};

export type TAnyDragEventHandler = DragEventHandler<HTMLElement>;
export type TAnyMouseEvent = ReactMouseEvent<HTMLElement>;
export type TAnyMouseEventHandler = MouseEventHandler<HTMLElement>;
export type TAnyKeyboardEvent = TEnhancedKeyboardEvent<HTMLElement>;

export type TInputOrTextAreaFocusEventHandler = (
  e: FocusEvent<HTMLInputElement> & FocusEvent<HTMLTextAreaElement>,
) => void;

export type TButtonMouseEvent = ReactMouseEvent<HTMLButtonElement>;
export type TButtonMouseEventHandler = MouseEventHandler<HTMLButtonElement>;
export type TButtonFocusEventHandler = FocusEventHandler<HTMLButtonElement>;
export type TButtonKeyDownEventHandler = (e: TEnhancedKeyboardEvent<HTMLButtonElement>) => void;

export type TImageErrorEvent = SyntheticEvent<HTMLImageElement>;

export type TInputBeforeInputEvent = TEnhancedFormEvent<HTMLInputElement>;
export type TInputClipboardEventHandler = ClipboardEventHandler<HTMLInputElement>;
export type TInputKeyboardEventHandler = KeyboardEventHandler<HTMLInputElement>;
export type TInputKeyDownEventHandler = (e: TEnhancedKeyboardEvent<HTMLInputElement>) => void;
export type TInputMouseEventHandler = MouseEventHandler<HTMLInputElement>;
export type TInputChangeEventHandler = ChangeEventHandler<HTMLInputElement>;
export type TInputFocusEventHandler = FocusEventHandler<HTMLInputElement>;

export type TLabelMouseEventHandler = MouseEventHandler<HTMLLabelElement>;
export type TLiKeyboardEvent = TEnhancedKeyboardEvent<HTMLLIElement>;
export type TLiMouseEvent = ReactMouseEvent<HTMLLIElement>;

export type TInertiaLinkMouseEvent = ReactMouseEvent<Element, MouseEvent>;
export type TLinkFocusEventHandler = FocusEventHandler<HTMLAnchorElement>;
export type TLinkMouseEvent = ReactMouseEvent<HTMLAnchorElement, MouseEvent>; // Pro inertia tem que ser esse
// export type TLinkMouseEventHandler = MouseEventHandler<HTMLAnchorElement>;
export type TLinkMouseEventHandler = MouseEventHandler;

export type TTextAreaChangeEventHandler = ChangeEventHandler<HTMLTextAreaElement>;
export type TTextAreaFocusEventHandler = FocusEventHandler<HTMLTextAreaElement>;
export type TTextAreaKeyboardEventHandler = KeyboardEventHandler<HTMLTextAreaElement>;

export type TTouchEventHandler = TouchEventHandler;

export type TFileDataTransferOrTarget = HTMLInputElement & DataTransfer;

export type TArrayKey = Array<string>;
export type TDottedKey = string;

export type TFormattedDate = string;
export type TFormattedDateHour = string;

export type TAnyOptionRows = Array<{id: number; label: string}>;

export type TLanguage = 'en' | 'es' | 'pt_BR';

export type TQueryStringValue = number | string | null | undefined;
export type TQueryStringData = {[key: string]: TQueryStringValue};

export type TTableId = number;
export type TTableData<T = TDBValue> = {[columnName: string]: T};

export type TFormCountryData = TsAllToString<TCountryDTO>;
export type TFormPhoneData = TsOverride<
  TsAllToString<TPhoneDTO>,
  {
    country_data?: TFormCountryData;
  }
>;
