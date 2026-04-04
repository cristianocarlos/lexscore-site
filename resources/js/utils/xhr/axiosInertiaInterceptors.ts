import {router} from '@inertiajs/react';

// import {getWindowLocationHostname} from '@/utils/globals';
import {getAppLoginPath} from '@/utils/import.meta';
import axiosAuthApi from '@/utils/xhr/axiosAuthApi';

export default () => {
  window.axios.interceptors.request.use(
    async (config) => {
      // console.log(111, 'request', config);
      // TODO: talvez não precise com o FPL
      /*
      const configPath = config.url?.replace(getWindowLocationHostname(), '');
      if (!config.headers['Authorization'] && configPath !== getAppLoginPath()) {
        await axiosAuthApi.authorizationHeaderStart(config);
      }
      */
      return config;
    },
    (error) => Promise.reject(error),
  );

  let isRefreshing = false;
  let failedQueue = [] as Array<{reject: (value: unknown) => void; resolve: (reason?: unknown) => void}>;

  const processQueue = (error?: unknown, accessToken?: string) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(accessToken);
      }
    });
    failedQueue = [];
  };

  window.axios.interceptors.response.use(
    (response) => {
      // console.log(222, 'response', response, isRefreshing);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      // console.log(222, error, isRefreshing, originalRequest._retry);
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({reject, resolve});
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return window.axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call refresh endpoint (uses HTTP-only cookie automatically)
          // Não pode ser o window.axios porque ele retorna um modal de erro
          // Também porque entra no loop por retornar 401
          const newAccessToken = await axiosAuthApi.accessTokenRefresh();

          // Retry original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(undefined, newAccessToken);
          return window.axios(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, undefined);
          // Refresh failed - clear token and redirect to login
          router.visit(getAppLoginPath());
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};
