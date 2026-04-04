import type {AxiosInstance} from 'axios';

export default (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      console.log(111, 'request.success', config);
      return config;
    },
    async (error) => {
      console.log(111, 'response.error', error);
      return Promise.reject(error)
    },
  );

  instance.interceptors.response.use(
    (response) => {
      console.log(222, 'response.success', response);
      return response;
    },
    async (error) => {
      console.log(222, 'response.error', error);
      return Promise.reject(error)
    },
  );
  return instance;
};
