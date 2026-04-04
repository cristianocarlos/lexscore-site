import {type TYiiModelNames} from '~/phpgen/yii-model';

import {usePage} from '@inertiajs/react';

import {recursiveSanitizeObjectValues} from '@/components/formigo/utils/sanitize';

import type {TFormigoFormFeatures} from '@/components/formigo/types/formigo';
import type {TDeepSanitizedValues} from '@/components/formigo/utils/sanitize';

export function useFormFeatures(formFeatures?: TFormigoFormFeatures) {
  const {props: pageProps} = usePage();
  return formFeatures || pageProps.formFeatures;
}

export function sanitizeFormFeaturesValues(values?: TFormigoFormFeatures['values']) {
  const sanitizedAttr = {} as TDeepSanitizedValues;
  values &&
    Object.keys(values).forEach((modelName) => {
      sanitizedAttr[modelName] = recursiveSanitizeObjectValues(values[modelName as TYiiModelNames]);
    });
  return sanitizedAttr;
}
