import {hasValue} from '@/utils/helper';

export const ADDRESS_KEYS = {
  city: 'city',
  cityDesc: 'city_desc',
  complement: 'complement',
  country: 'country',
  countryDesc: 'country_desc',
  description: 'description', // Uso externo complementar
  line1: 'line1',
  line2: 'line2',
  mailBox: 'mail_box', // Uso externo complementar
  number: 'number',
  phoneCountryData: 'phone_country_data', // Uso externo complementar
  phoneRows: 'phone_rows', // Uso externo complementar
  responsibleJobTitle: 'responsible_job_title', // Uso externo complementar
  responsibleName: 'responsible_name', // Uso externo complementar
  restrict: 'restrict', // Uso externo complementar
  type: 'type', // Uso externo complementar
  typeDesc: 'type_desc', // Uso externo complementar
  zipCode: 'zip_code',
} as const;

export const PHONE_GROUP_ADDITIONAL_INPUT_KEYS = {
  countryData: 'country_data',
  extension: 'extension',
  isMain: 'is_main',
  isRestrict: 'is_restrict',
  type: 'type',
  whatsappLink: 'whatsapp_link',
} as const;

export const PHONE_GROUP_KEYS = {...PHONE_GROUP_ADDITIONAL_INPUT_KEYS, number: 'number'} as const;

export function resolveGroupRows(quantity: number) {
  return Array.from(Array(quantity).keys());
}

export function resolveTableRows(quantity: number) {
  return Array.from(Array(quantity).keys());
}

export function resolveInputValue<GValue>(
  value?: GValue,
  defaultValue: number | string = '',
  componentName = '',
  attribute: Array<string> = [],
): string {
  try {
    const stringAttribute = attribute.join('.');
    const typeofValue = typeof value;
    if (value === null) {
      throw new Error(`${componentName}.${stringAttribute} is using 'null' as empty value, use 'undefined'`);
    } else if (value && typeof value !== 'string') {
      throw new Error(
        `${componentName}.${stringAttribute} value must be typeof 'string', typeof ${typeofValue} (${value}) was passed`,
      );
    }
  } catch (error) {
    // @ts-expect-error nem sei como faz
    const errorMessage = error.message;
    console.warn(errorMessage);
  }
  if (!hasValue(value)) return defaultValue?.toString();
  if (typeof value === 'boolean') return Number(value).toString(); // 0/1 porque false num hidden, por exemplo vai como string 'false' que o php considera true // bool2number Number(value) === +value
  if (typeof value === 'number') return value.toString();
  return value.toString();
}
