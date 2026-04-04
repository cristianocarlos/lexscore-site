import YiiLang from '~/phpgen/yii-lang';

import {initGoogleGtag, injectGoogleGtag} from '@/shared/utils/thirdPartyScript';
import {getWindowLocationPathname, getWindowLocationUrl} from '@/utils/globals';
import {getGtagTrackingId} from '@/utils/import.meta';

type TUseGoogleGtagConfig = {
  path?: string;
  skipPageViewPaths?: Array<string>;
  title: string;
  userId?: number;
};

type TUseGoogleGtagEventHandler = {
  category: string;
  action: string;
  label: string;
  nonInteraction?: boolean;
};

type TUseHandleGoogleGtagTrack = {
  anchorName?: string;
  nonInteraction?: boolean;
};

type TUseHandleGoogleGtagTrackHandler = {
  category?: string;
  eventName: string;
  label?: string;
};

export function useGoogleGtagConfig(params: TUseGoogleGtagConfig) {
  // if (import.meta.env.DEV) return;
  if (typeof window === 'undefined') return;

  const {path, skipPageViewPaths, title = YiiLang.misc('fragmentEmpty'), userId} = params;

  initGoogleGtag().then();
  injectGoogleGtag();

  const pagePath = path || getWindowLocationUrl();
  const sendPageView = skipPageViewPaths ? !skipPageViewPaths.includes(pagePath) : true;

  window.gtag('config', getGtagTrackingId(), {
    page_path: pagePath,
    page_title: title,
    send_page_view: sendPageView,
    user_id: userId,
  });
}

export function useGoogleGtagEvent() {
  return (params: TUseGoogleGtagEventHandler) => {
    // if (import.meta.env.DEV) return;
    if (typeof window === 'undefined') return;

    const {category, action, label, nonInteraction} = params;

    initGoogleGtag();
    injectGoogleGtag();

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      non_interaction: nonInteraction,
    });
  };
}

export function useHandleGoogleGtagTrack({anchorName, nonInteraction}: TUseHandleGoogleGtagTrack) {
  const handleGtagEvent = useGoogleGtagEvent();
  return ({category, eventName, label}: TUseHandleGoogleGtagTrackHandler) => {
    const defaultComplement = getWindowLocationPathname() + '#' + (anchorName || '');
    handleGtagEvent({
      action: eventName,
      category: category || defaultComplement,
      label: label || defaultComplement,
      nonInteraction: nonInteraction || false,
    });
  };
}
