import '~/css/app.css';

import {createInertiaApp} from '@inertiajs/react';
import axios from 'axios';

import axiosInertiaInterceptors from '@/utils/xhr/axiosInertiaInterceptors';

const interceptedAxios = axiosInertiaInterceptors(axios);
window.axios = interceptedAxios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createInertiaApp();

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
createInertiaApp();
*/
