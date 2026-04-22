import {createContext, type RefObject, useContext} from 'react';

import type {TRateProps} from '@/components/formigo/types/rate';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';

type TRatingContext = TRateProps & {
  handleInputChange: TInputChangeEventHandler;
  handleInputClick: TInputMouseEventHandler;
  inputId?: string;
  inputName?: string;
  inputValue?: string;
  refHtmlOptionList: RefObject<HTMLDivElement | null>;
};

export const RatingContext = createContext<TRatingContext | undefined>(undefined);

export function useRatingContext() {
  const context = useContext(RatingContext);
  if (!context) {
    throw Error('RatingContext must be used within a Dromigo');
  }
  return context;
}
