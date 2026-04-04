import YiiLang from '~/phpgen/yii-lang';

import {hasValue, stripTags} from '@/utils/helper';
import {
  isSafeInteger,
  isValidCnpj,
  isValidCpf,
  isValidCurrency,
  isValidDate,
  isValidDateHour,
  isValidEmail,
  isValidFloat,
  isValidHour,
  isValidPhoneNumber,
  isValidZipCode,
} from '@/utils/validators';

import type {TCheckBoxCheckValue} from '@/components/formigo/types/checkOrRadio';
import type {
  TFormigoAttribute,
  TFormigoValidatorBaseCallerProps,
  TFormigoValidatorGetAttrValue,
} from '@/components/formigo/types/formigo';

import type {TFormCountryData} from '@/types/common';

type TComboBoxSelectedOnlyValidatorCallerProps = TFormigoValidatorBaseCallerProps & {
  comboOptionLabelAttribute: TFormigoAttribute;
};

type TPasswordRepeatValidatorCallerProps = {newAttribute: TFormigoAttribute; repeatAttribute: TFormigoAttribute};

type TMaxSizeValidatorCallerProps = TFormigoValidatorBaseCallerProps & {maxSize: number};

type TMinSizeValidatorCallerProps = TFormigoValidatorBaseCallerProps & {minSize: number};

type TCheckRequiredValidatorCallerProps = TFormigoValidatorBaseCallerProps & {
  checkValue: TCheckBoxCheckValue | undefined;
};

type TDescriptionRequiredValidatorCallerProps = {comboOptionLabelAttribute: TFormigoAttribute};

type TDraftJsMaxLengthValidatorCallerProps = {htmlAttribute: TFormigoAttribute; maxLength: number};

type TPhoneNumberValidatorCallerProps = TFormigoValidatorBaseCallerProps & {countryDataAttribute?: TFormigoAttribute};

function resolveDateHourError(value: string) {
  const dateHourParts = value.split(' ');
  if (!isValidDate(dateHourParts[0])) {
    return YiiLang.formigo('feedbackFormValidatorDateInvalid');
  }
  if (!dateHourParts[1]) {
    return YiiLang.formigo('feedbackFormValidatorDateHourIncomplete');
  }
  if (!isValidHour(dateHourParts[1])) {
    return YiiLang.formigo('feedbackFormValidatorHourInvalid');
  }
  return YiiLang.formigo('feedbackUnknownError');
}

export function comboBoxSelectedOnlyValidator(callerProps: TComboBoxSelectedOnlyValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute, comboOptionLabelAttribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    const attrValueDescription = getAttrValue(comboOptionLabelAttribute);
    return attrValueDescription && !hasValue(attrValue) ? YiiLang.formigo('feedbackFormValidatorSelectedOnly') : null;
  };
}

export function cnpjValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidCnpj(attrValue) ? YiiLang.formigo('feedbackFormValidatorCnpjInvalid') : null;
  };
}

export function cpfValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidCpf(attrValue) ? YiiLang.formigo('feedbackFormValidatorCpfInvalid') : null;
  };
}

export function currencyValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidCurrency(attrValue) ? YiiLang.formigo('feedbackFormValidatorCurrencyInvalid') : null;
  };
}

export function dateValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidDate(attrValue) ? YiiLang.formigo('feedbackFormValidatorDateInvalid') : null;
  };
}

export function dateHourValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidDateHour(attrValue) ? resolveDateHourError(attrValue) : null;
  };
}

export function emailValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidEmail(attrValue) ? YiiLang.formigo('feedbackFormValidatorEmailInvalid') : null;
  };
}

export function floatValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidFloat(attrValue) ? YiiLang.formigo('feedbackFormValidatorFloatInvalid') : null;
  };
}

export function hourValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidHour(attrValue) ? YiiLang.formigo('feedbackFormValidatorHourInvalid') : null;
  };
}

export function integerValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isSafeInteger(attrValue) ? YiiLang.formigo('feedbackFormValidatorIntegerInvalid') : null;
  };
}

export function passwordRepeatValidator(callerProps: TPasswordRepeatValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {newAttribute, repeatAttribute} = callerProps;
    const newPassword = getAttrValue(newAttribute);
    const repeatPassword = getAttrValue(repeatAttribute);
    if (newPassword && repeatPassword && newPassword !== repeatPassword) {
      return YiiLang.formigo('feedbackFormValidatorRepeatPasswordError');
    }
    return null;
  };
}

export function phoneNumberValidator(callerProps: TPhoneNumberValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute, countryDataAttribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    const countryData = countryDataAttribute ? getAttrValue<TFormCountryData>(countryDataAttribute) : undefined;
    return attrValue && !isValidPhoneNumber(attrValue, countryData?.id)
      ? YiiLang.formigo('feedbackFormValidatorPhoneInvalid')
      : null;
  };
}

export function zipCodeValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue && !isValidZipCode(attrValue) ? YiiLang.formigo('feedbackFormValidatorZipCodeInvalid') : null;
  };
}

/**
 * Draft.js
 */

export function draftJsMaxLengthValidator(callerProps: TDraftJsMaxLengthValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {htmlAttribute, maxLength} = callerProps;
    const htmlValue = getAttrValue(htmlAttribute);
    let textPlainLength = 0;
    if (typeof htmlValue === 'string') {
      const textPlainValue = stripTags(htmlValue);
      textPlainLength = textPlainValue.trim().length;
    }
    return textPlainLength > maxLength
      ? YiiLang.formigo('feedbackFormValidatorMaxLengthDraftJsError') + ': ' + textPlainLength + '/' + maxLength
      : null;
  };
}

/**
 * MIN/MAX
 */

export function maxSizeValidator(callerProps: TMaxSizeValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute, maxSize} = callerProps;
    const attrValue = getAttrValue<Array<unknown> | NonNullable<unknown>>(attribute);
    const size = attrValue ? (Array.isArray(attrValue) ? attrValue : Object.keys(attrValue)).length : 0;
    return size > maxSize ? YiiLang.formigo('feedbackFormValidatorMaxSizeSelectionError') + ': ' + maxSize : null;
  };
}

export function minSizeValidator(callerProps: TMinSizeValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute, minSize} = callerProps;
    const attrValue = getAttrValue<Array<unknown> | NonNullable<unknown>>(attribute);
    const size = attrValue ? (Array.isArray(attrValue) ? attrValue : Object.keys(attrValue)).length : 0;
    return size < minSize ? YiiLang.formigo('feedbackFormValidatorMinSizeSelectionError') + ': ' + minSize : null;
  };
}

/**
 * REQUIRED
 */

export function checkRequiredValidator(callerProps: TCheckRequiredValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute, checkValue} = callerProps;
    const attrValue = getAttrValue(attribute);
    return attrValue !== checkValue ? YiiLang.formigo('feedbackFormValidatorRequired') : null;
  };
}

export function descriptionRequiredValidator(callerProps: TDescriptionRequiredValidatorCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {comboOptionLabelAttribute} = callerProps;
    const attrValue = getAttrValue(comboOptionLabelAttribute);
    return !hasValue(attrValue) ? YiiLang.formigo('feedbackFormValidatorRequired') : null;
  };
}

export function minSizeOneRequiredValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    const size = attrValue ? attrValue.length : 0;
    return size === 0 ? YiiLang.formigo('feedbackFormValidatorRequired') : null;
  };
}

export function requiredValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    return !hasValue(attrValue) ? YiiLang.formigo('feedbackFormValidatorRequired') : null;
  };
}
