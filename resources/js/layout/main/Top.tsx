import BreadCrumbs from '@/layout/main/BreadCrumbs';
import {usePageMetaData} from '@/shared/utils/usePageSlice';
import {zustandScreenSetValue} from '@/utils/zustand/screen/store';

import type {PropsWithChildren, ReactElement} from 'react';

type TProps = PropsWithChildren & {
  customTitles?: Array<string | {browserTitle: string; element: ReactElement}>;
};

function resolveElementTitles(titles: TProps['customTitles']): Array<ReactElement> {
  if (!titles) return [];
  return titles.map((value) => {
    if (typeof value === 'string') return <>{value}</>;
    return value.element;
  });
}

function resolveBrowserTitles(titles: TProps['customTitles']): Array<string> | undefined {
  if (!titles) return;
  return titles.map((value) => {
    if (typeof value === 'string') return value;
    return value.browserTitle;
  });
}

export default function Top({children, customTitles}: TProps) {
  const {titles: pageTitles} = usePageMetaData();
  zustandScreenSetValue('customBrowserTitles', customTitles ? resolveBrowserTitles(customTitles) : undefined);
  const elementTitles = customTitles ? resolveElementTitles(customTitles) : pageTitles;
  return (
    <div className="mt-8 flex flex-col gap-4">
      <div>
        {elementTitles?.[0] ? <h1 className="text-2xl font-semibold">{elementTitles[0]}</h1> : undefined}
        {elementTitles?.[1] ? <h2 className="text-lg font-medium">{elementTitles[1]}</h2> : undefined}
      </div>
      <BreadCrumbs />
      {children}
    </div>
  );
}
