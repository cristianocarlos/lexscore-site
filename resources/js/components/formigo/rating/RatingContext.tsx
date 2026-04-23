import {createContext, useContext} from 'react';

import type {TRatingProps} from '@/components/formigo/types/rating';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';
import type {RefObject} from 'react';

type TRatingContext = TRatingProps & {
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
    throw Error('RatingContext must be used within a Rating');
  }
  return context;
}
