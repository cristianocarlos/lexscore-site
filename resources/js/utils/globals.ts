import type {TLanguage} from '@/types/common';

export function getIsChromeBrowser() {
  if (typeof navigator === 'undefined') return;
  return !!(navigator.userAgent.match(/Chrome/g) && !navigator.userAgent.match(/Edg/g));
}

export function getIsFirefoxBrowser() {
  // return typeof InstallTrigger !== 'undefined';
  if (typeof navigator === 'undefined') return;
  return !!navigator.userAgent.match(/Firefox/g);
}

export function getIsIeBrowser() {
  if (typeof navigator === 'undefined') return;
  return !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
}

/**
 * É verdadeiro se o usuário estiver utilizando a aplicação em um dispositivo menor ou igual a 480px de largura ou se o
 * dispositivo estiver deitado e seu comprimento for menor ou igual a 896px.
 */
export function getIsMobile() {
  // 480 telefone mais largo, 896 telefone mais comprido, horizontal
  // iPhone XR: 414 x 896
  // Samsung Galaxy Note 5: 480 x 853
  if (typeof window === 'undefined') return;
  return window.innerWidth <= 480 || (window.innerWidth <= 896 && window.innerWidth > window.innerHeight);
}

export function getIsMobileOrTablet() {
  return getIsMobile() || getIsTablet();
}

/**
 * Checa se o usuario esta em um iPad ou se a largura do dispositivo é menor que 800px.
 */
export function getIsTablet() {
  // O ipad Pro deitado tem 1366 os demais 1024
  if (typeof window === 'undefined') return;
  return !!navigator.userAgent.match(/iPad/i) || window.innerWidth <= 800; // 800 Samsung Galaxy Tab 10
}

export function getLanguage(): TLanguage {
  return (getWindowLocalStorage().getItem('language') || 'pt_BR') as TLanguage;
}

export function getWindowLocation() {
  return typeof window === 'undefined' ? ({} as Location) : window.location;
}

export function getWindowLocationPathname() {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

export function getWindowLocationQueryString(prefix = '?') {
  if (typeof window === 'undefined') return '';
  if (!window.location.search) return '';
  return window.location.search.replace('?', prefix);
}

export function getWindowLocationHostname() {
  if (typeof window === 'undefined') return '';
  return window.location.protocol + '//' + window.location.hostname;
}

export function getWindowLocationUrl(queryString = '') {
  if (typeof window === 'undefined') return '';
  return window.location.pathname + (queryString || window.location.search);
}

export function getWindowLocalStorage() {
  return typeof window === 'undefined'
    ? ({
        getItem: (v) => v,
      } as Storage)
    : window.localStorage;
}

export function getDocument() {
  return typeof document === 'undefined' ? ({getElementById: (_v) => null} as Document) : document;
}
