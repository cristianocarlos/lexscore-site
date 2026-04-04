import YiiLang from '~/phpgen/yii-lang';

import {router} from '@inertiajs/react';
import {debounce as esToolkitDebounce} from 'es-toolkit/function';

import axiosFormigoApi from '@/components/formigo/snippet/axiosFormigoApi';
import {
  useDispatchFormigoSubmitValidate,
  useStoreFormigoSubmitErrorsGetValue,
} from '@/components/formigo/zustand/hooks';
import {usePageFormUrls} from '@/shared/utils/usePageSlice';

import type {TButtonMouseEvent} from '@/types/common';

export const preventDoubleSubmissionDebounce = esToolkitDebounce((target: HTMLButtonElement) => {
  target.disabled = false;
  target.title = '';
}, 5000);

function prepareSubmit(e?: TButtonMouseEvent) {
  let skipValidate = false;
  if (e) {
    e.preventDefault();
    const target = e.target as HTMLButtonElement; // Botão clicado (ou acionado pelo ENTER)
    target.focus(); // Precisa focar o botão (não foca em caso de ENTER) pra acionar o blur dos inputs e acionar as validações
    // preventDoubleSubmission
    target.disabled = true; // previne a dupla submissão do form
    target.title = YiiLang.formigo('hintFormProcessing');
    preventDoubleSubmissionDebounce(target);
    skipValidate = !!target.dataset.skipValidate;
  }
  return skipValidate;
}

export function customActionSubmit(formDom: HTMLFormElement, action: string) {
  const previousAction = formDom.action.replace(window.location.protocol + '//' + window.location.hostname, '');
  formDom.setAttribute('action', action);
  formDom.submit();
  formDom.setAttribute('action', previousAction);
}

/**
 * Primeiro estágio do submit, validação
 * Pode ser chamado na aplicação para enviar um form de maneira nativa, com formDom.submit()
 */
export function useHandleValidateSubmit() {
  const submitValidate = useDispatchFormigoSubmitValidate();
  const submitErrorsGetValue = useStoreFormigoSubmitErrorsGetValue();
  return async (e: TButtonMouseEvent) => {
    const skipValidate = prepareSubmit(e);
    const formDom = e.currentTarget.form;
    return new Promise((resolve) => {
      if (!skipValidate) submitValidate(); // Demora um pouco pra calcular os erros
      resolve(undefined);
    }).then(() => {
      const submitErrorsCount = skipValidate ? 0 : Object.keys(submitErrorsGetValue()).length; // Tem que usar props direto, sem destruct no início
      if (formDom && submitErrorsCount === 0) {
        return Promise.resolve(formDom);
      }
      return Promise.reject(new Error('[forms] input with errors: ' + submitErrorsCount + ', handled by application'));
    });
  };
}

/**
 * Segundo estágio do submit, envio dos dados usando fetch
 * Pode ser chamado na aplicação para uso do responseData sem o tratamento do responseData.feedback
 */
export function useHandleFetchSubmit() {
  const handleValidateSubmit = useHandleValidateSubmit();
  return async <GContent>(e: TButtonMouseEvent, abortSignal?: AbortSignal) => {
    return handleValidateSubmit(e).then(async (formDom) => {
      return axiosFormigoApi.formSubmit<GContent>(formDom, abortSignal);
    });
  };
}

/**
 * Terceiro estágio do submit, tratamento do responseData.feedback
 * Pode ser chamado na aplicação para uso do responseData após o tratamento do feedback
 */
export function useHandleRedirectSubmit() {
  const formUrls = usePageFormUrls();
  const handleFetchSubmit = useHandleFetchSubmit();
  return async <GContent>(e: TButtonMouseEvent, abortSignal?: AbortSignal) => {
    return handleFetchSubmit<GContent>(e, abortSignal).then((responseData) => {
      router.visit(formUrls.redirect, {replace: true});
      return Promise.resolve(responseData);
    });
  };
}
