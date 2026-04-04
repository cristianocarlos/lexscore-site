import {type AxiosRequestConfig} from 'axios';

import {zustandFormigoInputSetServerErrors} from '@/components/formigo/zustand/store';
import {resolveAxiosErrorData, screenErrorHandler} from '@/utils/xhr/axiosHelper';
import {zustandScreenSetValue} from '@/utils/zustand/screen/store';

import type {TAxiosApiResponse} from '@/utils/xhr/axiosHelper';

async function baseInertiaRequest<GContent = undefined, D = unknown>(config: AxiosRequestConfig<D>) {
  return window.axios<TAxiosApiResponse<GContent>>(config);
}

function formSubmitErrorHandler(error: unknown, formId: string): never {
  const errorData = resolveAxiosErrorData(error);
  if (errorData.response.status === 422) {
    zustandFormigoInputSetServerErrors(errorData.response.data.errors, formId);
    throw new Error('Validation error: ' + errorData.message, {cause: error});
  }
  zustandScreenSetValue('feedbackData', {
    message: errorData.response.status + ' ' + (errorData.response.statusText || errorData.response.data.message),
    response: errorData.response,
    success: false,
  });
  throw new Error('Submit error: ' + errorData.message, {cause: error});
}

async function addressGet<GContent>(url: string, signal?: AbortSignal) {
  try {
    const response = await baseInertiaRequest<GContent>({
      method: 'get',
      signal,
      url,
    });
    return response.data.content;
  } catch (error: unknown) {
    const errorData = resolveAxiosErrorData(error);
    // Erro formatado para o componente
    return Promise.resolve({
      error_message: errorData.message + ' | ' + errorData.response.data.message,
    } as GContent);
  }
}

async function comboOrSuggestGet<GContent>(url: string, signal?: AbortSignal) {
  try {
    const response = await baseInertiaRequest<GContent>({
      method: 'get',
      signal,
      url,
    });
    return response.data.content;
  } catch (error: unknown) {
    const errorData = resolveAxiosErrorData(error);
    // Erro formatado para o componente
    return Promise.resolve([{error_message: errorData.response.data.message, label: errorData.message}] as GContent);
  }
}

async function formSubmit<GContent = undefined>(formDom: HTMLFormElement, signal?: AbortSignal) {
  try {
    const response = await baseInertiaRequest<GContent>({
      data: new FormData(formDom),
      method: formDom.dataset.method,
      signal,
      url: formDom.getAttribute('action') || '',
    });
    const responseData = response.data;
    zustandScreenSetValue('feedbackData', {
      message: responseData.message,
      success: responseData.success,
    });
    return responseData;
  } catch (error: unknown) {
    formSubmitErrorHandler(error, formDom.getAttribute('id') || '');
  }
}

async function recordDelete(url: string) {
  try {
    const response = await baseInertiaRequest({
      method: 'delete',
      url: url,
    });
    const responseData = response.data;
    zustandScreenSetValue('feedbackData', {
      message: responseData.message,
      success: responseData.success,
    });
    return true;
  } catch (error: unknown) {
    screenErrorHandler(error);
  }
}

export default {
  addressGet,
  comboOrSuggestGet,
  formSubmit,
  formSubmitErrorHandler,
  recordDelete,
};
