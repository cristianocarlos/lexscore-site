import {hasValue, jsonParse} from '@/utils/helper';

import type {TQueryStringData, TQueryStringValue} from '@/types/common';

export function resolveObjectQueryParam(value: unknown) {
  if (!value) return '';
  if (typeof value === 'object') return '';
  return JSON.stringify(value).replaceAll('"', '');
  // return JSON.stringify(value).replace('{', '').replace('}', '').replaceAll('"', '');
}

export function resolveArrayQueryParam(value: unknown) {
  if (!Array.isArray(value)) return '';
  return '[' + value + ']';
  // return value.toString();
}

export function queryStringParse(locationSearch: string): Record<string, string> {
  const search = locationSearch.substring(1);
  const json = '{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}';
  return jsonParse(json) || {};
}

export function queryStringStringify(obj: TQueryStringData, shouldRemoveUndefined = false) {
  const urlSearchRecord = resolveQueryStringRecord(obj, shouldRemoveUndefined);
  // toString no createSearchParams transforma tudo em strings, inclusive palavras chave como 'null' e 'undefined'
  // o urlSearchRecord contém esses valores convertidos para vazio
  if (!urlSearchRecord) return '';
  return '?' + new URLSearchParams(urlSearchRecord).toString();
}

export function queryStringCustomStringify(obj: {[key: string]: unknown}, shouldRemoveUndefined = false) {
  const objectKeys = Object.keys(obj);
  if (objectKeys.length === 0) return '';
  // import { createSearchParams, useNavigate } from 'react-router'
  // certo seria usar o createSearchParams do react-router-dom, mas na Análise usamos a query string de array assim:
  // aba=[1, 2], enquanto createSearchParams cria assim aba=1&aba=2, que até ta certo, mas nao sei bem como usar isso no server
  // o location.search adicona "?" automaticamente, mas se usarmos em outro lugar tem que lembrar de por
  // Então é melhor deixar aqui por padrão já que o location.search não duplica, caso exista
  let customQueryString = '';
  let urlSearchRecordCount = 0;
  const urlSearchRecord: {[key: string]: string} = {};
  objectKeys.forEach((itemKey) => {
    const value = obj[itemKey] as TQueryStringValue;
    if (value && typeof value === 'object') {
      customQueryString += customQueryString ? '&' : '';
      customQueryString += Array.isArray(value)
        ? itemKey + '=' + resolveArrayQueryParam(value)
        : itemKey + '=' + resolveObjectQueryParam(value);
    } else {
      const resolvedValue = resolveQueryStringValue(value, shouldRemoveUndefined);
      if (typeof resolvedValue !== 'undefined') {
        urlSearchRecord[itemKey] = resolvedValue;
        urlSearchRecordCount++;
      }
    }
  });
  const parts = [];
  if (urlSearchRecordCount) parts.push(new URLSearchParams(urlSearchRecord).toString());
  if (customQueryString) parts.push(customQueryString);
  if (parts.length === 0) return '';
  return '?' + parts.join('&');
}

function resolveQueryStringValue(value: TQueryStringValue, shouldRemoveUndefined = false) {
  if (typeof value === 'undefined' && shouldRemoveUndefined) return undefined; // Quando nao for pra remover, o undefined é convertido pra string vazia
  return hasValue(value) ? value.toString() : '';
}

function resolveQueryStringRecord(obj: TQueryStringData, shouldRemoveUndefined?: boolean) {
  const objectKeys = Object.keys(obj);
  if (objectKeys.length === 0) return undefined;
  const urlSearchRecord: {[key: string]: string} = {};
  objectKeys.forEach((itemKey) => {
    const resolvedValue = resolveQueryStringValue(obj[itemKey], shouldRemoveUndefined);
    if (typeof resolvedValue !== 'undefined') {
      urlSearchRecord[itemKey] = resolvedValue;
    }
  });
  if (Object.keys(urlSearchRecord).length === 0) return undefined;
  return urlSearchRecord;
}

/**
 * Gera uma string de consulta personalizada para um formulário HTML.
 * Esta função analisa os elementos do formulário e cria um objeto de parâmetros
 * com base nos valores dos elementos. Em seguida, usa a função queryStringCustomStringify
 * para converter esse objeto em uma string de consulta.
 * @see queryStringCustomStringify
 */
export function resolveFormAsQueryString(formDom: HTMLFormElement) {
  const elementsLength = formDom.elements.length;
  let count = 0;
  const urlParams: {[key: string]: unknown} = {};
  for (let i = 0; i < elementsLength; i++) {
    const element = formDom.elements[i] as HTMLInputElement;
    const datasetType = element.dataset.type;
    let resolvedValue;
    switch (element.type) {
      case 'text':
        if (datasetType !== 'skip-url-query-string') {
          resolvedValue = element.value;
        }
        break;
      case 'checkbox':
        if (datasetType !== 'check-group' && element.checked) {
          resolvedValue = element.value;
        }
        break;
      case 'radio':
        if (element.checked) {
          resolvedValue = element.value;
        }
        break;
      case 'hidden':
        if (datasetType === 'check-group-values' || datasetType === 'json-value') {
          // queryStringCustomStringify precisa receber um objeto converter em parametro [1,2]
          resolvedValue = jsonParse(element.value);
        } else if (datasetType === 'suggest-select-option-id') {
          resolvedValue = element.value;
        }
        break;
      default:
    }
    if (resolvedValue) {
      urlParams[element.name] = resolvedValue;
      count++;
    }
  }
  if (count === 0) return '';
  return queryStringCustomStringify(urlParams);
}

export function resolveSearchParamsAsQueryString(searchParams: URLSearchParams) {
  if (!searchParams) return '';
  const searchParamsAsString = searchParams.toString();
  if (!searchParamsAsString) return '';
  return '?' + decodeURIComponent(searchParamsAsString);
}
