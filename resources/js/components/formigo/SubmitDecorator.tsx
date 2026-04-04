import {useMemo, useState} from 'react';

import {sanitizeFormFeaturesValues, useFormFeatures} from '@/components/formigo/snippet/formFeatures';

import {
  customActionSubmit,
  preventDoubleSubmissionDebounce,
  useHandleFetchSubmit,
  useHandleRedirectSubmit,
  useHandleValidateSubmit,
} from '@/components/formigo/utils/submitHooks';
import {FormigoContext} from '@/components/formigo/utils/withContext';
import {useDispatchFormigoProduceStoreState} from '@/components/formigo/zustand/hooksSetterSlice';
import {uniqueId} from '@/utils/helper';
import {useDidMountEffect, useWillUnmountEffect} from '@/utils/hooks';

import type {TFormigoFormFeatures} from '@/components/formigo/types/formigo';
import type {TButtonMouseEvent} from '@/types/common';
import type {FunctionComponent} from 'react';

export type TFormigoRedirectSubmitHandler = (
  e: TButtonMouseEvent,
  abortSignal?: AbortSignal,
  preventOverlap?: boolean,
) => Promise<unknown>; // Não setar tipo, refatorar para submitHooks

export default function SubmitDecorator<G>(ComposedComponent: FunctionComponent<G>) {
  function Decorated(props: G & {id?: string; formFeatures?: TFormigoFormFeatures}) {
    const [isReady, setReady] = useState(false);

    const formId = useMemo(() => props.id || uniqueId(), [props.id]);

    const formFeatures = useFormFeatures(props.formFeatures);

    const produceStoreState = useDispatchFormigoProduceStoreState();

    const contextValues = {
      formId: formId,
      recordId: formFeatures?.recordId,
      recordValues: formFeatures?.values,
    };

    useDidMountEffect(() => {
      new Promise((resolve) => {
        produceStoreState((proxyState) => {
          proxyState[formId] = {
            attr: sanitizeFormFeaturesValues(formFeatures?.values),
          };
        });
        resolve(undefined);
      }).then(() => {
        setReady(true);
      });
    });

    useWillUnmountEffect(() => {
      produceStoreState((proxyState) => {
        delete proxyState[formId];
      });
      preventDoubleSubmissionDebounce.cancel();
    });

    if (!isReady) return;

    return (
      <FormigoContext.Provider value={contextValues}>
        <ComposedComponent {...props} />
      </FormigoContext.Provider>
    );
  }

  return Decorated;
}

export {customActionSubmit, useHandleFetchSubmit, useHandleRedirectSubmit, useHandleValidateSubmit};
