import '~/css/app.css';

import {createInertiaApp} from '@inertiajs/react';
import axios from 'axios';

import ErrorBoundary from '@/components/portal/ErrorBoundary';
import axiosInertiaInterceptors from '@/utils/xhr/axiosInertiaInterceptors';

import type {ReactNode} from 'react';

const interceptedAxios = axiosInertiaInterceptors(axios);
interceptedAxios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
if (typeof window !== 'undefined') window.axios = interceptedAxios;

createInertiaApp({
  withApp: (app: ReactNode) => <ErrorBoundary>{app}</ErrorBoundary>,
});

/*
import {axiosAdapter} from '@inertiajs/core';
import {createInertiaApp} from '@inertiajs/react';
import axios from 'axios';

import axiosInertiaInterceptors from '@/utils/xhr/axiosInertiaInterceptors';

const interceptedAxios = axiosInertiaInterceptors(axios);
window.axios = interceptedAxios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createInertiaApp({
  http: axiosAdapter(window.axios),
  withApp: (app: ReactNode) => <ErrorBoundary>{app}</ErrorBoundary>,
});
*/

/*
import {createInertiaApp, http} from '@inertiajs/react';
http.onRequest((config) => {
  console.log(111, 'request.success', config);
  return config
});

http.onResponse((response) => {
  console.log(222, 'response.success', response);
  return response
});

http.onError((error) => {
  console.log(111, 'request.success', error);
  console.error('Request failed:', error)
});
createInertiaApp({
  withApp: (app: ReactNode) => <ErrorBoundary>{app}</ErrorBoundary>,
});
*/
