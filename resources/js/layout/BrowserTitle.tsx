import {usePageMetaData} from '@/shared/utils/usePageSlice';
import {getAppName} from '@/utils/import.meta';
import {useSelectorScreenValue} from '@/utils/zustand/screen/hooks';

function resolveTitle(browserTitle?: string) {
  if (browserTitle && browserTitle !== getAppName()) return browserTitle + ' | ' + getAppName();
  return getAppName();
}

export default function BrowserTitle() {
  const {titles: pageTitles} = usePageMetaData();
  const customBrowserTitles = useSelectorScreenValue('customBrowserTitles');
  const resolvedTitles = customBrowserTitles || pageTitles;
  return <title>{resolveTitle(resolvedTitles?.[0])}</title>;
}
