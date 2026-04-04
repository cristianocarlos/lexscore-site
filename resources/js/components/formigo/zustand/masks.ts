import {guessFormattedDate, guessFormattedDateHour, valueAsNumber} from '@/utils/helper';
import {formatDate, formatDateHour} from '@/utils/luxon';
import {
  formatCnpj,
  formatCpf,
  formatCurrency,
  formatFloat,
  formatPhoneNumber,
  formatZipCode,
  MASKS,
} from '@/utils/masks';
import {
  isValidCnpj,
  isValidCpf,
  isValidCurrency,
  isValidDate,
  isValidDateHour,
  isValidHour,
  isValidPhoneNumber,
  isValidZipCode,
} from '@/utils/validators';

import type {TFormigoMasks} from '@/components/formigo/types/formigo';

/**
 * Formata valor digitado no campo, pode conter erros e deve ser validado
 */
export function formatEnteredValue(mask: TFormigoMasks, value?: string) {
  if (!value) return value;
  switch (mask) {
    case MASKS.brPhoneNumber:
      // pt_br
      return isValidPhoneNumber(value) ? formatPhoneNumber(value) : undefined;
    case MASKS.cnpj:
      return isValidCnpj(value) ? formatCnpj(value) : undefined;
    case MASKS.cpf:
      return isValidCpf(value) ? formatCpf(value) : undefined;
    case MASKS.currency:
      return isValidCurrency(value) ? formatCurrency(value) : undefined;
    case MASKS.date: {
      if (isValidDate(value)) return formatDate(value);
      const guessFormattedValue = guessFormattedDate(value); // Caso não seja válido, tenta "adivinhar" com base nos números digitados
      return isValidDate(guessFormattedValue) ? formatDate(guessFormattedValue) : undefined;
    }
    case MASKS.dateHour: {
      if (isValidDateHour(value)) return formatDateHour(value);
      const guessFormattedValue = guessFormattedDateHour(value); // Caso não seja válido, tenta "adivinhar" com base nos números digitados
      return isValidDateHour(guessFormattedValue) ? formatDateHour(guessFormattedValue) : undefined;
    }
    case MASKS.hour: {
      if (isValidHour(value, 'allowInt')) {
        const resolvedValue = valueAsNumber(value);
        if (resolvedValue >= 0 && resolvedValue <= 9) {
          return '0' + Number(value) + ':00';
        }
        if (resolvedValue >= 10 && resolvedValue <= 23) {
          return value + ':00';
        }
      }
      return undefined;
    }
    case MASKS.zipCode:
      // pt_br
      return isValidZipCode(value) ? formatZipCode(value) : undefined;
    default:
      return value;
  }
}

/**
 * Formata valor inicial, espera-se o valor correto, geralmente do banco de dados
 */
export function formatValue(mask: TFormigoMasks, value?: string) {
  if (!value) return value;
  switch (mask) {
    case MASKS.brPhoneNumber:
      // pt_br
      return formatPhoneNumber(value);
    case MASKS.cnpj:
      return formatCnpj(value);
    case MASKS.cpf:
      return formatCpf(value);
    case MASKS.currency:
      return formatCurrency(value);
    case MASKS.float:
      return formatFloat(value);
    case MASKS.date:
      return formatDate(value);
    case MASKS.dateHour:
      return formatDateHour(value);
    case MASKS.zipCode:
      // pt_br
      return formatZipCode(value);
    default:
      return value;
  }
}
