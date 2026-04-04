import {type TYiiModelNames} from '~/phpgen/yii-model';

import {createContext, useContext} from 'react';

import type {TFormigoFormFeatures} from '@/components/formigo/types/formigo';

export type TFormigoContext = {
  formId: string;
  recordId?: TFormigoFormFeatures['recordId'];
  recordValues?: TFormigoFormFeatures['values'];
};

export const FormigoContext = createContext<TFormigoContext | undefined>(undefined);

export function useFormigoContext() {
  const context = useContext(FormigoContext);
  if (!context) {
    throw Error('FormigoContext must be used within a SubmitDecorator(Form)');
  }
  return context;
}

export function useFormigoContextRecordId() {
  return useFormigoContext().recordId;
}

export function useFormigoContextFormId() {
  return useFormigoContext().formId;
}

export function useFormigoContextIsNewRecord() {
  return !useFormigoContextRecordId();
}

export function useFormigoContextModelValues<G>(modelName?: TYiiModelNames) {
  const recordValues = useFormigoContext().recordValues;
  if (!recordValues) {
    throw new Error(`formFeatures.values must be setted`);
  }
  if (!modelName) return recordValues as G;
  const modelValues = recordValues[modelName];
  if (!modelValues) {
    throw new Error(`formFeatures.values[${modelName}] must be setted`);
  }
  return modelValues as G;
}
