import YiiModel, {type TYiiModelColumnSize} from '~/phpgen/yii-model';

import {useMemo} from 'react';

import {MASKS} from '@/utils/masks';

import type {TFormigoAttribute, TFormigoLabel} from '@/components/formigo/types/formigo';

type THtmlProps = {
  id: string;
  label?: TFormigoLabel;
  maxLength?: number;
  name: string;
  placeholder?: string; // Para o html só pode ser string ou undefined
};

type THtmlPropsParams = {
  attribute: TFormigoAttribute;
  label?: TFormigoLabel;
  mask?: string;
  maxLength?: number;
  placeholder?: string | null; // null pq o label pode ser atribuído ao placeholder
  shouldUseModelSchemaMaxLength?: boolean;
};

type TResolveMaxLength = {
  mask?: string;
  modelColumnSize: number;
};

type TResolvePlaceHolder = {
  label?: TFormigoLabel;
  mask?: string;
  placeholder?: string | null; // null pq o label pode ser atribuído ao placeholder
};

export function resolveValue(value: unknown) {
  const resolvedValue = value === null || typeof value === 'undefined' ? '' : value;
  // Booleano precisa resolver inteiro 0/1 porque false num hidden, por exemplo vai como 'false' que o php considera true
  return typeof resolvedValue === 'boolean' ? Number(resolvedValue) : resolvedValue; // bool2number Number(value) === +value
}

function resolveMaxLength({mask, modelColumnSize}: TResolveMaxLength) {
  switch (mask) {
    case 'currency': {
      let resolvedColumnSize = modelColumnSize - 3; // desconsidera a vírgula e as duas casas decimais
      resolvedColumnSize -= Math.trunc(resolvedColumnSize / 3); // ajusta o tamanho máximo por causa dos pontos
      return resolvedColumnSize;
    }
    case 'float':
      return modelColumnSize - 3; // desconsidera a vírgula e as duas casas decimais pra garantir uma sobra
    default:
  }
  return modelColumnSize;
}

function resolvePlaceholder({label, mask, placeholder}: TResolvePlaceHolder) {
  let resolvedPlaceholder;
  if (placeholder !== null) {
    // null tem relevância aqui, é tratado diferente de undefined
    switch (mask) {
      case MASKS.brPhoneNumber:
        resolvedPlaceholder = placeholder || '__ ____-____';
        break;
      case MASKS.cnpj:
        resolvedPlaceholder = placeholder || '__.___.___/____-__';
        break;
      case MASKS.cpf:
        resolvedPlaceholder = placeholder || '___.___.___-__';
        break;
      case MASKS.date:
        resolvedPlaceholder = placeholder || '__/__/_____';
        break;
      case MASKS.hour:
        resolvedPlaceholder = placeholder || '__:__';
        break;
      case MASKS.dateHour:
        resolvedPlaceholder = placeholder || '__/__/_____ __:__';
        break;
      case MASKS.currency:
        resolvedPlaceholder = placeholder || '0,00';
        break;
      default:
        resolvedPlaceholder = placeholder || (typeof label === 'string' ? label : undefined);
    }
  }
  return resolvedPlaceholder;
}

export function resolveAttributeName(attribute: TFormigoAttribute) {
  if (attribute.length === 1) {
    return attribute[0];
  }
  // replace substitui só a primeira ocorrência de ][
  // a primeira expressão retorna ModelName][prop1][prop2]
  // o replace dexa a string ModelName[prop1][prop2]
  return (attribute.join('][') + ']').replace('][', '[');
}

export default function useHtmlProps(params: THtmlPropsParams) {
  const {attribute, label, mask, maxLength, placeholder, shouldUseModelSchemaMaxLength} = params;
  return useMemo(() => {
    const htmlProps = {} as THtmlProps;

    // Quando o atributo tem um ítem só, é um campo sem model
    const modelName = attribute.length === 1 ? undefined : attribute[0];
    const attributeName = modelName ? attribute[1] : attribute[0];

    // id, name
    htmlProps.id = attribute.join('_');
    htmlProps.name = resolveAttributeName(attribute);

    // label, placeholder
    if (placeholder !== null) {
      // null tem relevância aqui, é tratado diferente de undefined
      htmlProps.placeholder = resolvePlaceholder({label, mask, placeholder});
    }

    if (label !== null) {
      // null tem relevância aqui, é tratado diferente de undefined
      // Mesmo tendo "label ||" aqui, precisa ter também no InputWrapper, a propriedade que pode mudar condicionalmente
      htmlProps.label = label;
    }

    // maxLength
    if (maxLength) {
      htmlProps.maxLength = maxLength;
    } else if (modelName && attributeName && shouldUseModelSchemaMaxLength) {
      const modelColumnSize = YiiModel.columnSize((modelName + '.' + attributeName) as TYiiModelColumnSize);
      if (modelColumnSize) {
        htmlProps.maxLength = resolveMaxLength({mask, modelColumnSize});
      }
    }

    return htmlProps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
