import YiiConst from '~/phpgen/yii-const';
import YiiLang from '~/phpgen/yii-lang';

import {Component} from 'react';

import {getWindowLocationPathname} from '@/utils/globals';
import {getAppVersion} from '@/utils/import.meta';
import axiosAppApi from '@/utils/xhr/axiosAppApi';
import {stateToolGetDebugState} from '@/utils/zustand/helper';

import Portal from './Portal';

import type {TDottedKey} from '@/types/common';
import type {ErrorInfo, ReactNode} from 'react';

export type TErrorBoundaryDebugStateRows = Array<{storeId: string; dataKeyPath: TDottedKey}>;

type TErrorBoundaryProps = {
  children: ReactNode;
  errorBoundaryDebugStateRows?: TErrorBoundaryDebugStateRows;
};

type TStateErrorBoundary = {
  hasError?: boolean;
  message?: string;
};

const LS_HARD_RELOADED_KEY = 'errorBoundaryHardReloaded';

function shouldHardReload(message?: string) {
  if (!message) return false;
  const error1 = 'TypeError: Failed to fetch dynamically imported module';
  const error2 = "TypeError: 'text/html' is not a valid JavaScript MIME type"; // Safari
  const error3 = 'TypeError: TypeError: error loading dynamically imported module'; // Firefox
  const error4 = 'TypeError: Importing a module script failed';
  const error5 = 'Unable to preload CSS for';
  return (
    message.includes(error1) ||
    message.includes(error2) ||
    message.includes(error3) ||
    message.includes(error4) ||
    message.includes(error5)
  );
}

class ErrorBoundary extends Component<TErrorBoundaryProps, TStateErrorBoundary> {
  constructor(props: TErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: undefined,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Ainda não da pra saber onde aconteceu o erro, só que aconteceu :/
    const {errorBoundaryDebugStateRows} = this.props;
    const message = error.toString(); // Failed to fetch dynamically imported module
    const bodyParams = {
      debugState: errorBoundaryDebugStateRows ? stateToolGetDebugState(errorBoundaryDebugStateRows) : undefined,
      info: shouldHardReload(message) ? {customMessage: 'hard-reload'} : info,
      message,
      pathname: getWindowLocationPathname(),
    };
    axiosAppApi.post(YiiConst.RouteEnum.API_ERROR_BOUNDARY_LOG, bodyParams).catch(() => null);
  }

  static getDerivedStateFromError(error: Error) {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return {
      hasError: true,
      message: error.toString(),
    };
  }

  render() {
    if (this.state.hasError) {
      const localStorageKey = LS_HARD_RELOADED_KEY + '-' + getAppVersion();
      if (localStorage.getItem(localStorageKey) !== 'true' && shouldHardReload(this.state.message)) {
        window.location.reload();
        localStorage.setItem(localStorageKey, 'true');
        return null;
      }
      return (
        <Portal id="feedback">
          <div className="z-modal fixed top-0 right-0 bottom-0 left-0 flex justify-center bg-gray-700">
            <div className="flex w-3/4 flex-col gap-2 rounded-lg p-20 text-white">
              <p>{YiiLang.misc('infoErrorBondary')}</p>
              <p className="text-xs">{this.state.message}</p>
              <a className="mt-8" href="/">
                {YiiLang.misc('textPageRefresh')}
              </a>
            </div>
          </div>
        </Portal>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
