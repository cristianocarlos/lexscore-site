import {usePage} from '@inertiajs/react';

import type {PageProps as AppPageProps} from '@/types/page';

export function usePageAuthUser() {
  const {
    props: {authUser},
  } = usePage();
  return authUser;
}

export function usePageMetaData() {
  const {
    props: {metaData},
  } = usePage();
  if (!metaData) {
    throw new Error('metaData must be setted on controller');
  }
  return metaData;
}

export function usePageMetaDataRouteParamId() {
  const metaData = usePageMetaData();
  return metaData.routeParamId;
}

export function usePageStaticOptions<G = NonNullable<AppPageProps['staticOptions']>[string]>(key: string) {
  const {
    props: {staticOptions},
  } = usePage();
  const options = staticOptions?.[key];
  if (!options) {
    throw new Error(`staticOptions[${key}] must be setted on controller`);
  }
  return options as G;
}

export function usePageFormUrls() {
  const metaData = usePageMetaData();
  return {
    apiDelete: metaData.apiDeleteUrl || '',
    apiSave: metaData.apiSaveUrl || '',
    redirect: metaData.redirectUrl || '',
  };
}

export function usePageMetaDataChildNav() {
  const metaData = usePageMetaData();
  return {
    createUrl: metaData.childNav?.createUrl || '',
    updatePath: metaData.childNav?.updatePath || '',
  };
}

export function usePageMetaDataParentNav() {
  const metaData = usePageMetaData();
  return {
    redirectUrl: metaData.parentNav?.redirectUrl || '',
  };
}

export function usePageChildRows<G>() {
  const {
    props: {childRows},
  } = usePage();
  return childRows as G;
}
