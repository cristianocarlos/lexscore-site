import {DateTime, Info, Settings} from 'luxon';

import {getLanguage} from '@/utils/globals';

import type {TFormattedDate, TFormattedDateHour} from '@/types/common';
import type {
  TLuxonDateObjectUnits,
  TLuxonDateTimeFormatOptions,
  TLuxonDayNumbers,
  TLuxonDayOfWeekNumbers,
  TLuxonDuration,
  TLuxonDurationValid,
  TLuxonHourNumbers,
  TLuxonMinuteNumbers,
  TLuxonMonthNumbers,
  TLuxonParam,
  TLuxonValid,
  TLuxonWeekOfYearNumbers,
} from '@/types/thirdParty';

type TDurationParts = {
  days: number;
  hours: number;
  minutes: number;
  months: number;
  seconds: number;
  years: number;
};

Settings.defaultLocale = getLanguage().replace('_', '-');
// Settings.defaultZoneName = 'America/Sao_Paulo'; // Isso, nem faz sentido, tem que deixar acontecer automáticamente

const jsDate = new Date();
export const CURRENT_YEAR = jsDate.getFullYear();
export const MAX_VALID_YEAR = CURRENT_YEAR + 40;
export const MIN_VALID_YEAR = 1800;

export const MIN_VALID_MILLIS = 210946500000; // 1976-09-07 09:15:00 aleatório, basicamente pra identificar que veio um Date.now() de parâmetro
export const ONE_MINUTE_IN_MILLIS = 60000;

export const DAY_OF_WEEK_SATURDAY = 6;
export const DAY_OF_WEEK_SUNDAY = 7;

/** ***************************
 ******************************
 **** private core parsers ****
 ******************************
 **************************** */

function parseStringLuxon(value: number | string | null | undefined) {
  if (!value) return DateTime.invalid(`!value ≡ ${value}`);
  if (typeof value !== 'string') return DateTime.invalid(`typeof value !== 'string' ≡ ${value}`); // Luxon inválido
  // if (isSafeNumeric(value)) return DateTime.invalid(`isSafeNumeric(${value})`); // Luxon inválido não considerar número-string
  if (value === '24:00') return DateTime.invalid(`value === '24:00' ≡ ${value}`); // Luxon inválido 24:00 é uma hora válida do dia seguinte, não considerar
  if (value.includes(' 24:00')) return DateTime.invalid(`value.includes(' 24:00') ≡ ${value}`); // Luxon inválido 24:00 é uma hora válida do dia seguinte, não considerar) return DateTime.fromJSDate(undefined); // Luxon inválido 24:00 é uma hora válida do dia seguinte, não considerar. precisa do espaço por que é possível 23:24:00
  // Quando a data é anterior a 1914-01-01, o Postgres armazena o timezone diferente, incluindo com minutos e segundos
  // Não parece ter algo haver com o postgres, mas com o timezone, se usarmos o DateTime.DATETIME_SHORT_WITH_SECONDS
  // para formatar uma data antes de 1914, vai formatar com 28 segundos a menos ex: 31/12/1913 00:00:00 vira 30/12/1913 23:59:32
  // Exemplos:
  // 1914-01-01 12:00:00-03 salva como 1914-01-01 12:00:00-03
  // 1913-12-31 12:00:00-03 salva como 1913-12-31 11:53:32-03:06:28 (timezonado com 6min e 28s a menos)
  // O luxon não aceita o formato com segundos, então testamos o tamanho da string
  // Caso o timezone contenha minutos e segundos, corta os segundos fora
  // const resolvedValue = value.length === 28 ? value.substring(0, 25) : value;
  const resolvedValue = value.length === 28 ? value.substring(0, 25) : value;
  let valueLuxon = DateTime.fromISO(resolvedValue);
  if (!valueLuxon.isValid) {
    valueLuxon = DateTime.fromSQL(resolvedValue);
    if (!valueLuxon.isValid) {
      const formats = ['dd/MM/yyyy', 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy HH:mm:ss'];
      for (let i = 0; i < formats.length; i++) {
        const customValueLuxon = DateTime.fromFormat(resolvedValue, formats[i]);
        if (customValueLuxon.isValid) {
          valueLuxon = customValueLuxon;
          break;
        }
      }
    }
  }
  return valueLuxon;
}

/**
 * @param value
 * @param minValidMillis para durantions não da pra usar o MIN_VALID_MILLIS, precisa ser 0
 */
function parseAnyLuxon(value: TLuxonParam, minValidMillis = MIN_VALID_MILLIS) {
  // undefined, null, ''
  if (!value) return DateTime.invalid('!value');
  let valueLuxon: DateTime<true> | DateTime<false>;
  if (value instanceof DateTime) {
    valueLuxon = value;
  } else if (typeof value === 'number') {
    if (value >= minValidMillis) {
      valueLuxon = DateTime.fromMillis(value);
    } else {
      valueLuxon = DateTime.invalid('value < minValidMillis (' + minValidMillis + ')');
    }
  } else if (value instanceof Date) {
    valueLuxon = DateTime.fromJSDate(value);
  } else {
    valueLuxon = parseStringLuxon(value);
  }
  return valueLuxon;
}

/** ******************
 *********************
 **** main parser ****
 *********************
 ******************* */

/**
 * https://moment.github.io/luxon/docs/manual/parsing.html
 * https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromSQL
 */
export function parseLuxon(value: TLuxonValid, adjustments?: TLuxonDateObjectUnits): TLuxonValid;
export function parseLuxon(value: TLuxonParam, adjustments?: TLuxonDateObjectUnits): TLuxonValid | undefined;
export function parseLuxon(value: TLuxonParam, adjustments?: TLuxonDateObjectUnits) {
  const valueLuxon = parseAnyLuxon(value);
  if (valueLuxon.isValid) return adjustments ? valueLuxon.set(adjustments) : valueLuxon;
  // return DateTime.invalid(`Parametro value inválido ≡ ${value}`);
  // console.warn(`Parametro data inválido ≡ ${value}`);
  // Não retorna luxon deliberadamente, as funcões usadas externamente não podem acessar nenhum recurso exclusivo do luxon
  return undefined;
}

/** ************************
 ***************************
 **** formatted parsers ****
 ***************************
 ************************* */

export function parseFormattedDateLuxon(value: unknown) {
  // pt_BR
  if (typeof value !== 'string') return undefined;
  const valueLuxon = DateTime.fromFormat(value, 'dd/MM/yyyy');
  return valueLuxon.isValid ? valueLuxon : undefined;
}

export function parseFormattedDateHourLuxon(value: unknown) {
  // pt_BR
  if (typeof value !== 'string') return undefined;
  if (value.includes('24:00')) return undefined;
  const valueLuxon = DateTime.fromFormat(value, 'dd/MM/yyyy HH:mm');
  return valueLuxon.isValid ? valueLuxon : undefined;
}

export function parseFormattedHourLuxon(value: unknown) {
  // pt_BR
  if (typeof value !== 'string') return undefined;
  if (value === '24:00') return undefined;
  const valueLuxon = DateTime.fromFormat(value, 'HH:mm');
  return valueLuxon.isValid ? valueLuxon : undefined;
}

/** ********************
 ***********************
 **** modifiers add ****
 ***********************
 ********************* */

export function addDays(value: TLuxonValid, amount: number): TLuxonValid;
export function addDays(value: TLuxonParam, amount: number): TLuxonValid | undefined;
export function addDays(value: TLuxonParam, amount: number) {
  return parseLuxon(value)?.plus({days: amount});
}

export function addMinutes(value: TLuxonValid, amount: number): TLuxonValid;
export function addMinutes(value: TLuxonParam, amount: number): TLuxonValid | undefined;
export function addMinutes(value: TLuxonParam, amount: number) {
  return parseLuxon(value)?.plus({minutes: amount});
}

export function addMonths(value: TLuxonValid, amount: number): TLuxonValid;
export function addMonths(value: TLuxonParam, amount: number): TLuxonValid | undefined;
export function addMonths(value: TLuxonParam, amount: number) {
  return parseLuxon(value)?.plus({months: amount});
}

export function addWeeks(value: TLuxonValid, amount: number): TLuxonValid;
export function addWeeks(value: TLuxonParam, amount: number): TLuxonValid | undefined;
export function addWeeks(value: TLuxonParam, amount: number) {
  return parseLuxon(value)?.plus({weeks: amount});
}

export function addYears(value: TLuxonValid, amount: number): TLuxonValid;
export function addYears(value: TLuxonParam, amount: number): TLuxonValid | undefined;
export function addYears(value: TLuxonParam, amount: number) {
  return parseLuxon(value)?.plus({years: amount});
}

/** **********************
 *************************
 **** modifiers start ****
 *************************
 *********************** */

export function startOfDay(value: TLuxonValid): TLuxonValid;
export function startOfDay(value: TLuxonParam): TLuxonValid | undefined;
export function startOfDay(value: TLuxonParam) {
  return parseLuxon(value)?.startOf('day');
}

export function startOfMonth(value: TLuxonValid): TLuxonValid;
export function startOfMonth(value: TLuxonParam): TLuxonValid | undefined;
export function startOfMonth(value: TLuxonParam) {
  return parseLuxon(value)?.startOf('month');
}

/**
 * Considera segunda-feira o começo da semana
 */
export function startOfWeek(value: TLuxonValid): TLuxonValid;
export function startOfWeek(value: TLuxonParam): TLuxonValid | undefined;
export function startOfWeek(value: TLuxonParam) {
  return parseLuxon(value)?.startOf('week');
}

export function startOfYear(value: TLuxonParam): TLuxonValid;
export function startOfYear(value: TLuxonParam): TLuxonValid | undefined;
export function startOfYear(value: TLuxonParam) {
  return parseLuxon(value)?.startOf('year');
}

/** ********************
 ***********************
 **** modifiers end ****
 ***********************
 ********************* */

export function endOfDay(value: TLuxonValid): TLuxonValid;
export function endOfDay(value: TLuxonParam): TLuxonValid | undefined;
export function endOfDay(value: TLuxonParam) {
  return parseLuxon(value)?.endOf('day');
}

export function endOfMonth(value: TLuxonValid): TLuxonValid;
export function endOfMonth(value: TLuxonParam): TLuxonValid | undefined;
export function endOfMonth(value: TLuxonParam) {
  return parseLuxon(value)?.endOf('month');
}

/**
 * Considera domingo o término da semana
 */
export function endOfWeek(value: TLuxonValid): TLuxonValid;
export function endOfWeek(value: TLuxonParam): TLuxonValid | undefined;
export function endOfWeek(value: TLuxonParam) {
  return parseLuxon(value)?.endOf('week');
}

/** *****************
 ********************
 **** formatters ****
 ********************
 ****************** */

/**
 * https://moment.github.io/luxon/docs/manual/formatting.html
 */
export function format(mask: string | TLuxonDateTimeFormatOptions, value: TLuxonParam) {
  const valueLuxon = parseLuxon(value);
  if (!valueLuxon) return '';
  if (typeof mask === 'object') return valueLuxon.toLocaleString(mask);
  return valueLuxon.toFormat(mask);
}

export function formatDate(value: TLuxonParam): TFormattedDate {
  return format(DateTime.DATE_SHORT, value);
}

export function formatDateHour(value: TLuxonParam): TFormattedDateHour {
  // return format(DateTime.DATETIME_SHORT, value); // Esta caralha passou a enfiar uma vírgula entre o ano e a hora a partir da versão 110 do Chrome
  return format('dd/MM/yyyy HH:mm', value);
}

export function formatDbDate(value: TLuxonParam) {
  // ISO 8601 format
  return format('yyyy-MM-dd', value);
}

export function formatDbDateHour(value: TLuxonParam) {
  // ISO 8601 format
  return format('yyyy-MM-dd HH:mm', value);
}

export function formatDbTimestamp(value: TLuxonParam) {
  // ISO 8601 format
  return format('yyyy-MM-dd HH:mm:ss', value);
}

export function formatHour(value: TLuxonParam) {
  return format(DateTime.TIME_24_SIMPLE, value);
}

/** ********************
 ***********************
 **** getters parts ****
 ***********************
 ********************* */

export function getDayOfMonth(value: TLuxonValid): TLuxonDayNumbers;
export function getDayOfMonth(value: TLuxonParam): TLuxonDayNumbers | undefined;
export function getDayOfMonth(value: TLuxonParam) {
  return parseLuxon(value)?.day;
}

/**
 * Resultado: 1 seg, 2 ter, 3 qua, 4 qui, 5 sex, 6 sab, 7 dom
 */
export function getDayOfWeek(value: TLuxonValid): TLuxonDayOfWeekNumbers;
export function getDayOfWeek(value: TLuxonParam): TLuxonDayOfWeekNumbers | undefined;
export function getDayOfWeek(value: TLuxonParam) {
  return parseLuxon(value)?.weekday;
}

export function getDayOfYear(value: TLuxonValid): number;
export function getDayOfYear(value: TLuxonParam): number | undefined;
export function getDayOfYear(value: TLuxonParam) {
  return parseLuxon(value)?.ordinal;
}

export function getHour(value: TLuxonValid): TLuxonHourNumbers;
export function getHour(value: TLuxonParam): TLuxonHourNumbers | undefined;
export function getHour(value: TLuxonParam) {
  return parseLuxon(value)?.hour;
}

export function getMillis(value: TLuxonValid): number;
export function getMillis(value: TLuxonParam): number | undefined;
export function getMillis(value: TLuxonParam) {
  return parseLuxon(value)?.toMillis();
}

export function getMinute(value: TLuxonValid): TLuxonMinuteNumbers;
export function getMinute(value: TLuxonParam): TLuxonMinuteNumbers | undefined;
export function getMinute(value: TLuxonParam) {
  return parseLuxon(value)?.minute;
}

/**
 * @returns 1..12
 */
export function getMonth(value: TLuxonValid): TLuxonMonthNumbers;
export function getMonth(value: TLuxonParam): TLuxonMonthNumbers | undefined;
export function getMonth(value: TLuxonParam) {
  return parseLuxon(value)?.month;
}

/**
 * @returns janeiro..dezembro
 */
export function getMonthLong(value: TLuxonValid): string;
export function getMonthLong(value: TLuxonParam): string | undefined;
export function getMonthLong(value: TLuxonParam) {
  return parseLuxon(value)?.monthLong;
}

export function getWeekOfYear(value: TLuxonValid): TLuxonWeekOfYearNumbers;
export function getWeekOfYear(value: TLuxonParam): TLuxonWeekOfYearNumbers | undefined;
export function getWeekOfYear(value: TLuxonParam) {
  return parseLuxon(value)?.weekNumber;
}

export function getYear(value: TLuxonValid): number;
export function getYear(value: TLuxonParam): number | undefined;
export function getYear(value: TLuxonParam) {
  return parseLuxon(value)?.year;
}

/** ***************************
 ******************************
 **** main getter duration ****
 ******************************
 **************************** */

export function getDiffInLuxonDuration(startValue: TLuxonValid, endValue: TLuxonValid): TLuxonDurationValid;
export function getDiffInLuxonDuration(startValue: TLuxonParam, endValue: TLuxonParam): TLuxonDurationValid | undefined;
export function getDiffInLuxonDuration(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = parseAnyLuxon(endValue, 0).diff(parseAnyLuxon(startValue, 0), [
    'days',
    'hours',
    'minutes',
    'months',
    'seconds',
    'years',
  ]);
  return luxonDuration.isValid ? luxonDuration : undefined;
}

/** ***********************
 **************************
 **** getters duration ****
 **************************
 ************************ */

export function getDurationAsDays(luxonDuration: TLuxonDuration) {
  return luxonDuration.isValid ? Math.floor(luxonDuration.as('days')) : undefined; // duration é fracionado, precisa arredondar
}

export function getDurationAsHours(luxonDuration: TLuxonDuration) {
  return luxonDuration.isValid ? Math.floor(luxonDuration.as('hours')) : undefined; // duration é fracionado, precisa arredondar
}

export function getDurationAsMillis(luxonDuration: TLuxonDurationValid): number;
export function getDurationAsMillis(luxonDuration: TLuxonDuration): number | undefined;
export function getDurationAsMillis(luxonDuration: TLuxonDurationValid) {
  return luxonDuration.isValid ? luxonDuration.as('milliseconds') : undefined;
}

export function getDurationAsMinutes(luxonDuration: TLuxonDurationValid): number;
export function getDurationAsMinutes(luxonDuration: TLuxonDuration): number | undefined;
export function getDurationAsMinutes(luxonDuration: TLuxonDuration) {
  return luxonDuration.isValid ? Math.floor(luxonDuration.as('minutes')) : undefined; // duration é fracionado, precisa arredondar
}

export function getDurationAsMonths(luxonDuration: TLuxonDuration) {
  return luxonDuration.isValid ? Math.floor(luxonDuration.as('months')) : undefined; // duration é fracionado, precisa arredondar
}

export function getDurationAsWeeks(luxonDuration: TLuxonDuration) {
  return luxonDuration.isValid ? Math.ceil(luxonDuration.as('weeks')) : undefined; // Arredondado pra cima
}

export function getDurationAsYears(luxonDuration: TLuxonDuration) {
  return luxonDuration.isValid ? Math.floor(luxonDuration.as('years')) : undefined; // duration é fracionado, precisa arredondar
}

/**
 * Obtém cada parte de uma duração, por exemplo, uma duração de '2000-01-02 02:00:00' a '2021-01-01 03:30:30'
 * years: 20, months: 11, days: 30, hours: 1, minutes: 30, seconds, 30
 *
 * Diferente dos métodos getDurationAs* que retornam o total absoluto
 * years: 20, months: 252, days: 7660, hours: 183841, minutes: 11030490, seconds, 661829430
 */
export function getDurationParts(luxonDuration: TLuxonDurationValid): TDurationParts;
export function getDurationParts(luxonDuration: TLuxonDuration): TDurationParts | undefined;
export function getDurationParts(luxonDuration: TLuxonDuration) {
  if (luxonDuration.isValid) {
    const {days, hours, minutes, months, seconds, years} = luxonDuration;
    return {
      days,
      hours,
      minutes,
      months,
      seconds: Math.floor(seconds),
      years,
    };
  }
  return undefined;
}

/** *******************
 **********************
 **** getters diff ****
 **********************
 ******************** */

export function getDiffInDays(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsDays(luxonDuration);
}

export function getDiffInHours(startValue: TLuxonValid, endValue: TLuxonValid): number;
export function getDiffInHours(startValue: TLuxonParam, endValue: TLuxonParam): number | undefined;
export function getDiffInHours(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsHours(luxonDuration);
}

export function getDiffInMillis(startValue: TLuxonValid, endValue: TLuxonValid): number;
export function getDiffInMillis(startValue: TLuxonParam, endValue: TLuxonParam): number | undefined;
export function getDiffInMillis(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsMillis(luxonDuration);
}

export function getDiffInMinutes(startValue: TLuxonValid, endValue: TLuxonValid): number;
export function getDiffInMinutes(startValue: TLuxonParam, endValue: TLuxonParam): number | undefined;
export function getDiffInMinutes(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsMinutes(luxonDuration);
}

export function getDiffInMonths(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsMonths(luxonDuration);
}

export function getDiffInWeeks(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsWeeks(luxonDuration);
}

export function getDiffInYears(startValue: TLuxonParam, endValue: TLuxonParam) {
  const luxonDuration = getDiffInLuxonDuration(startValue, endValue);
  if (!luxonDuration) return undefined;
  return getDurationAsYears(luxonDuration);
}

/** **************
 *****************
 **** helpers ****
 *****************
 *************** */

export function getLuxonNow(): TLuxonValid {
  return DateTime.local();
}

export function getShortWeekDayNames() {
  // 0 seg, 1 ter, 2 qua, 3 qui, 4 sex, 5 sab, 6 dom
  const weekDayNames = Info.weekdaysFormat('short');
  const newWeekDayNames: {[key: string]: string} = {};
  weekDayNames.forEach((weekDayName, weekDayIndex) => {
    newWeekDayNames[weekDayIndex + 1] = weekDayName;
  });
  // 1 seg, 2 ter, 3 qua, 4 qui, 5 sex, 6 sab, 7 dom
  return newWeekDayNames;
}

export function getUtcOffset() {
  return getLuxonNow().offset;
}

export function isSameDay(value1: TLuxonParam, value2: TLuxonParam) {
  const value1Luxon = parseLuxon(value1);
  const value2Luxon = parseLuxon(value2);
  return value1Luxon && value2Luxon
    ? value1Luxon.startOf('day').equals(value2Luxon.startOf('day'))
    : value1Luxon === value2Luxon;
}

export function isWeekend(value: TLuxonParam) {
  const dayOfWeek = getDayOfWeek(value);
  return dayOfWeek === DAY_OF_WEEK_SATURDAY || dayOfWeek === DAY_OF_WEEK_SUNDAY;
}
