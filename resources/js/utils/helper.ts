import YiiConst from '~/phpgen/yii-const';

import {isTypeOfSafeNumber} from '@/utils/validators';

import type {TAnyMouseEvent, TAnyOptionRows, TFormPhoneData} from '@/types/common';

export const DEFAULT_EMPTY_CHAR = '-';

const DBL_CLICK_TIMEOUT_DATA: {count: number; id: number | undefined} = {
  count: 0,
  id: undefined,
};

export const HOME_COUNTRY_DATA = {
  dialing_code: YiiConst.Country.HOME_DIALING_CODE,
  id: YiiConst.Country.HOME,
  iso2_id: YiiConst.Country.HOME_ISO2_ID,
  name: YiiConst.Country.HOME_DESC,
};

/**
 * Remove todos as duplicidades de um array
 * @example
 *  // yields ["apple", "banana", "orange"]
 *  arrayRemoveEmpty(["apple", "banana", "banana", "orange"])
 */
export function arrayRemoveDuplicates<G>(arrayValue: Array<G>) {
  // return [...new Set(array)]; // Por benchmark, filter no nosso caso é mais rapido
  return arrayValue.filter((value, index) => {
    return arrayValue.indexOf(value) === index;
  });
}

/**
 * Remove todos os elementos vazios de um array.
 * Um elemento é considerado vazio se a função hasValue retornar falso para ele.
 * @see hasValue
 * @example
 *  // yields ["apple", "banana", "orange"]
 *  arrayRemoveEmpty(["apple", "", "banana", null, "orange"])
 */
export function arrayRemoveEmpty<G>(arrayValue: Array<G>) {
  return arrayValue.filter((value) => {
    return hasValue(value);
  });
}

/**
 * Capitaliza as letras em uma string.
 * Se o valor passado for outro tipo alem de string, retorna o valor.
 */
export function capitalize<G>(value: G) {
  if (typeof value !== 'string') return value;
  const newValue = value.toLowerCase().replace(/(^\w)|(\s+\w)/g, (letter) => letter.toUpperCase());
  return (
    newValue
      // Sant'ana, Del'arco, Dall'armellina, Dall'acqua, Dall'agnol (no php precisa um tratamento especial, aqui não)
      // D'Alessandro, D'Arc
      .replaceAll("D'a", "D'A")
      .replaceAll("D'á", "D'Á")
      .replaceAll("D'e", "D'E")
      .replaceAll("D'i", "D'I")
      .replaceAll("D'o", "D'O")
      .replaceAll("D'u", "D'U")
      .replaceAll(' Da ', ' da ')
      .replaceAll(' Das ', ' das ')
      .replaceAll(' De ', ' de ')
      .replaceAll(' Der ', ' der ')
      .replaceAll(' Do ', ' do ')
      .replaceAll(' Dos ', ' dos ')
      .replaceAll(' E ', ' e ')
      .replaceAll(' Van ', ' van ')
      .replaceAll(' Von ', ' von ')
      .replaceAll(' de Ré ', ' De Ré ')
      .replaceAll(' de Re ', ' De Re ')
      .replace(new RegExp(' de Ré$'), ' De Ré')
      .replace(new RegExp(' de Re$'), ' De Re')
      .replaceAll(' S.a', ' S.A')
      .replaceAll(' S/a', ' S.A')
      .replaceAll(' S/A', ' S.A')
  );
}

/**
 * Retorna o caractere padrão (DEFAULT_EMPTY_CHAR) se o valor fornecido for considerado vazio.
 * Um valor é considerado vazio se a função hasValue retornar falso para ele.
 * @see hasValue
 */
export function emptyChar<G>(value?: G, char = DEFAULT_EMPTY_CHAR) {
  return hasValue(value) ? value : char;
}

/**
 * Retorna o caractere padrão (DEFAULT_EMPTY_CHAR) se o valor fornecido for considerado vazio considerando 0, '0' e '0.0'.
 * Para definir se um elemento é vazio, consulte a função hasValue.
 * @see hasValue
 */
export function emptyCharWhenZero(value?: number | string, char = DEFAULT_EMPTY_CHAR) {
  if (value === 0 || value === '0' || value === '0.0') return char;
  return hasValue(value) ? value : char;
}

/**
 * Capitaliza a primeira letra de uma string.
 * Se o valor passado for outro tipo alem de string, retorna o valor.
 */
export function firstLetterUpperCase(value?: string) {
  if (typeof value !== 'string') return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Pega o primeiro PhoneData de uma lista que é do tipo UNKNOWN_MOBILE.
 * Caso nenhum numero do tipo UNKNOWN_MOBILE for encontrado, retorna undefined.
 */
export function getFirstMobilePhoneData(rows: Array<TFormPhoneData>) {
  if (!rows) return undefined;
  return rows.find((data) => valueAsNumber(data.type) === YiiConst.phone.UNKNOWN_MOBILE);
}

/**
 * Recebe um array de objeto e usa o id pra obter
 */
export function getOptionData<T extends {id: number | string}>(options: Array<T>, id: number | string) {
  if (!hasValue(id)) return undefined;
  if (!options) return undefined;
  const optionData = options.find((data) => valueAsString(data.id) === valueAsString(id));
  if (!optionData) return undefined;
  return optionData;
}

/**
 * Gera uma lista de opções para uma sequência de números, incluindo o primeiro e o último número.
 */
export function getSequenceOptions(firstNumber: number, lastNumber: number) {
  const options: TAnyOptionRows = [];
  if (firstNumber > lastNumber) {
    for (let i = firstNumber; i >= lastNumber; i--) {
      options.push({id: i, label: valueAsString(i)});
    }
  } else {
    for (let i = firstNumber; i <= lastNumber; i++) {
      options.push({id: i, label: valueAsString(i)});
    }
  }
  return options;
}

/**
 * Este método assume que a string fornecida representa uma data no formato 'DDMMYYYY'.
 * @returns A data formatada no formato 'DD/MM/YYYY' se a entrada for válida, caso contrário, null.
 */
export function guessFormattedDate(value: string) {
  // pt_br
  const strippedValue = stripNonNumber(value);
  if (strippedValue.length !== 8) return null;
  return strippedValue.substring(0, 2) + '/' + strippedValue.substring(2, 4) + '/' + strippedValue.substring(4, 8);
}

/**
 * Este método assume que a string fornecida representa uma data e hora no formato 'DDMMYYYYHHMM'.
 * @returns A data e hora formatadas no formato 'DD/MM/YYYY HH:MM' se a entrada for válida, caso contrário, null.
 */
export function guessFormattedDateHour(value: string) {
  // pt_br
  const strippedValue = stripNonNumber(value);
  if (strippedValue.length !== 12) return null;
  return (
    strippedValue.substring(0, 2) +
    '/' +
    strippedValue.substring(2, 4) +
    '/' +
    strippedValue.substring(4, 8) +
    ' ' +
    strippedValue.substring(8, 10) +
    ':' +
    strippedValue.substring(10, 12)
  );
}

export function handleDoubleClick(dblClickCallback: () => void, singleClickCallback?: () => void, delay = 400) {
  DBL_CLICK_TIMEOUT_DATA.count++;
  if (DBL_CLICK_TIMEOUT_DATA.count === 1) {
    DBL_CLICK_TIMEOUT_DATA.id = window.setTimeout(() => {
      DBL_CLICK_TIMEOUT_DATA.count = 0;
      if (singleClickCallback) {
        singleClickCallback.call(undefined);
      }
    }, delay);
  } else if (DBL_CLICK_TIMEOUT_DATA.count === 2) {
    window.clearTimeout(DBL_CLICK_TIMEOUT_DATA.id);
    DBL_CLICK_TIMEOUT_DATA.count = 0;
    dblClickCallback.call(undefined);
  }
}

/**
 * Retorna verdadeiro se o valor passado não for undefined, null e nem uma string vazia.
 * Essa funcao não tem suporte para Arrays e objetos e retornara true indenpendente do valor.
 */
export function hasValue<G>(value: G): value is NonNullable<G> {
  if (typeof value === 'undefined') return false;
  if (value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

export function jsonParse<G>(value: string | null | undefined) {
  if (!value) return undefined;
  try {
    const parsedValue = JSON.parse(value); // number | string | boolean | null | object
    if (parsedValue && typeof parsedValue === 'object') {
      return parsedValue as G;
    }
    return undefined;
  } catch (_e) {
    return undefined;
  }
}

export function objectAsFormData(data: unknown) {
  const formData = new FormData();
  recursiveBuildFormData(formData, data);
  return formData;
}

/**
 * Quando um elemento está por cima de outro, o de cima com um clique e o debaixo tem um duplo clique
 * Ao clicar no de cima não se quer que o debaixo seja acionado no segundo clique
 */
export function preventDoubleClick(e: TAnyMouseEvent, delay = 400) {
  // preventDoubleClick
  const targetStyle = e.currentTarget.style;
  targetStyle.pointerEvents = 'none';
  window.setTimeout(() => {
    targetStyle.pointerEvents = 'auto';
  }, delay);
}

function recursiveBuildFormData(formData: FormData, data: unknown, parentKey?: string) {
  if (data instanceof Date || data instanceof File || data instanceof Blob) return;
  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach((key) => {
      recursiveBuildFormData(formData, data[key as keyof typeof data], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else if (parentKey) {
    formData.append(parentKey, valueAsString(data as FormDataEntryValue));
  }
}

/**
 * Recebe um array de objeto e usa o id pra filtrar (não funciona sem a propriedade id e quando o id não for integer)
 */
export function refineOptions<G extends TAnyOptionRows[number]>(
  options: Array<G>,
  ids: Array<number>,
  notIncludes = false,
) {
  return options.filter((data) => {
    const dataValue = valueAsNumber(data.id);
    return notIncludes ? !ids.includes(dataValue) : ids.includes(dataValue);
  });
}

export function resolveFullPhoneNumber(data: TFormPhoneData) {
  const countryData = data.country_data;
  return (countryData?.dialing_code || HOME_COUNTRY_DATA.dialing_code) + '' + stripNonNumber(data.number);
}

export function stripNonNumber(value?: number | string) {
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (Number.isNaN(value)) return '';
  let resolvedValue;
  if (typeof value === 'number') {
    resolvedValue = isTypeOfSafeNumber(value)
      ? valueAsString(value)
      : value.toLocaleString('fullwide', {useGrouping: false});
  } else {
    resolvedValue = value;
  }
  return resolvedValue.replace(/\D/g, '');
}

export function stripTags<G extends number | string | undefined>(value: G) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/(<([^>]+)>)/gi, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll(/\s+/g, ' '); // Remove espaços duplicados recursivamente
}

export function strToNumeric<G extends number | string | undefined>(value: G) {
  // pt_br
  if (typeof value !== 'string') return value;
  return value.replaceAll('.', '').replace(',', '.');
}

export function uniqueId(length = 16) {
  const startPosition = 2;
  const endPosition = startPosition + length;
  return Math.random().toString(20).substring(startPosition, endPosition);
}

/*
 * Maluquisse condicional em vez de usar overload, só por diversão
 */
export function valueAsNumber<
  P extends boolean | number | string | null | undefined,
  R = P extends boolean | string | number ? number : undefined,
>(value: P) {
  if (typeof value === 'number') {
    // console.warn('value is already a number');
    return value as R;
  }
  if (!value) return undefined as R;
  return Number(value) as R;
}

/*
 * Maluquisse condicional em vez de usar overload, só por diversão
 */
export function valueAsString<
  P extends boolean | number | string | FormDataEntryValue | null | undefined,
  R = P extends boolean | number | string | FormDataEntryValue ? string : undefined,
>(value: P) {
  if (typeof value === 'string') return value as R;
  if (value === false) return '0' as R;
  if (value === 0) return '0' as R;
  if (!value) return undefined as R;
  if (value === true) return '1' as R;
  return value.toString() as R;
}

export function zeroFill(value: number | string, length: number) {
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (typeof value === 'number') return value.toString().padStart(length, '0');
  return value.padStart(length, '0');
}
