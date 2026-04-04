import type {TFormigoFormFeatures} from '@/components/formigo/types/formigo';
import type {Config} from 'ziggy-js';
import type {TAuthUserDTO} from '~/phpgen/types-dto';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  authUser: TAuthUserDTO | null;
  childRows?: Array<Record<string, number | string>>;
  formFeatures?: TFormigoFormFeatures;
  metaData?: {
    additional: Record<string, string>;
    apiDeleteUrl: string;
    apiSaveUrl: string;
    breadCrumbs: Array<{label: string; path?: string}>;
    childNav?: {createUrl: string; updatePath: string};
    controllerPath: string;
    createUrl: string;
    parentNav?: {redirectUrl: string};
    redirectUrl: string;
    routeParamId: number;
    routeParams: Record<string, string>;
    screenId: number;
    titles: Array<string>;
    updatePath?: string;
  };
  staticOptions?: Record<string, Array<{id: number; label: string}>>;
  ziggy: Config & {location: string};
};
