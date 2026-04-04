import {getGtagTrackingId, getGtagUrl} from '@/utils/import.meta';

export function initGoogleGtag() {
  const src = getGtagUrl();
  const trakingId = getGtagTrackingId();
  const id = 'google-gtag';
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return;
    const script = document.getElementById(id);
    if (script) {
      resolve(true); // true isAlreadyLoaded
    } else {
      const newScript = document.createElement('script');
      newScript.setAttribute('async', '');
      newScript.src = src + trakingId;
      newScript.id = id;
      document.body.appendChild(newScript);
      newScript.onload = () => {
        const intervalId = window.setInterval(() => {
          if (window.gtag !== undefined) {
            window.clearInterval(intervalId); // Espera carregar para resolver
            resolve(false);
          }
        }, 200);
      };
    }
  });
}

export function injectGoogleGtagScript() {
  if (typeof document === 'undefined') return;
  const id = 'inline-google-analytics';
  const script = document.getElementById(id);
  if (!script) {
    const newScript = document.createElement('script');
    newScript.setAttribute('type', 'text/javascript');
    newScript.id = id;
    newScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
    `;
    document.body.appendChild(newScript);
  }
}

export function injectGoogleGtag() {
  if (typeof window !== 'undefined') {
    if (typeof window.gtag === 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
      gtag('js', new Date());
    }
  }
}
