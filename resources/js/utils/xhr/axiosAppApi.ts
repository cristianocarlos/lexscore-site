import {screenErrorHandler} from '@/utils/xhr/axiosHelper';

import type {TAxiosApiResponse} from '@/utils/xhr/axiosHelper';
import type {AxiosRequestConfig} from 'axios';

async function baseInertiaRequest<GContent = undefined, D = unknown>(config: AxiosRequestConfig<D>) {
  // const axiosInstance = axios.create(); // Precisa ser a instancia do inertia que roda o refresh no 401
  const axiosInstance = window.axios;
  // axiosAuthApi.authorizationHeaderReplicate(axiosInstance);
  return axiosInstance<TAxiosApiResponse<GContent>>(config);
}

//////
//////
//////

async function apiGet<GContent = undefined>(url: string, params?: unknown, signal?: AbortSignal) {
  return baseInertiaRequest<GContent>({method: 'get', params, signal, url})
    .then((response) => response.data)
    .catch(screenErrorHandler);
}

async function apiPatch<GContent = undefined>(url: string, data?: unknown, signal?: AbortSignal) {
  return baseInertiaRequest<GContent>({data, method: 'patch', signal, url})
    .then((response) => {
      return response.data;
    })
    .catch(screenErrorHandler);
}

async function apiPost<GContent = undefined>(url: string, data?: unknown, signal?: AbortSignal) {
  return baseInertiaRequest<GContent>({data, method: 'post', signal, url})
    .then((response) => response.data)
    .catch(screenErrorHandler);
}

async function apiPut<GContent = undefined>(url: string, data?: unknown, signal?: AbortSignal) {
  return baseInertiaRequest<GContent>({data, method: 'put', signal, url})
    .then((response) => response.data)
    .catch(screenErrorHandler);
}

//////
//////
//////

export default {
  get: apiGet,
  patch: apiPatch,
  post: apiPost,
  put: apiPut,
};
