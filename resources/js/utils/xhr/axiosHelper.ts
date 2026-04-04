import {isAxiosError} from 'axios';

import {zustandScreenSetValue} from '@/utils/zustand/screen/store';

import type {AxiosResponse} from 'axios';

export type TSubmitResponseData = {errors?: {[dottedColumnId: string]: Array<string>}; message: string};
export type TAxiosApiResponse<G = undefined> = {message: string; success: boolean; content: G};

export class ProperError extends Error {
  status?: number;
  response?: AxiosResponse;
  serverMessage?: string;

  constructor(message: string, status?: number, response?: AxiosResponse, serverMessage?: string) {
    super(message);
    this.name = 'CustomError';
    this.status = status;
    this.response = response;
    this.serverMessage = serverMessage;
  }
}

export function screenErrorHandler(rawError: unknown): never {
  const errorData = resolveAxiosErrorData(rawError);
  zustandScreenSetValue('feedbackData', {
    message: errorData.response.status + ' ' + errorData.response.statusText,
    response: errorData.response,
    success: false,
  });
  throw rawError;
}

export function resolveAxiosErrorData(error: unknown) {
  if (!error) throw new Error('Burro error');
  if (!isAxiosError(error)) throw new Error('Unknown error', {cause: error});
  if (!error.response) throw new Error('Unknown response', {cause: error});
  return {message: error.message, response: error.response};
}
