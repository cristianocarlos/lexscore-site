import type {PageProps as AppPageProps} from './page';
import type {PageProps as InertiaPageProps} from '@inertiajs/core';
import type {AxiosInstance} from 'axios';

declare global {
  interface Window {
    axios: AxiosInstance;
    dataLayer: Array<unknown>; // gtag
  }
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, AppPageProps {}
}
