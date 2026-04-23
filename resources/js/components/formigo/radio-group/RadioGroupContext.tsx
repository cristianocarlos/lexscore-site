import {createContext, useContext} from 'react';

import type {TRadioGroupProps} from '@/components/formigo/types/radioGroup';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';

export type TRadioGroupContextProps = {
  handleInputChange: TInputChangeEventHandler;
  handleInputClick: TInputMouseEventHandler;
  inputId?: string;
  inputName?: string;
  inputValue?: string;
};

type TRadioGroupContext = TRadioGroupProps & {
  handleInputChange: TInputChangeEventHandler;
  handleInputClick: TInputMouseEventHandler;
  inputId?: string;
  inputName?: string;
  inputValue?: string;
};

export const RadioGroupContext = createContext<TRadioGroupContext | undefined>(
  undefined,
);

export function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw Error('RadioGroupContext must be used within a RadioGroup');
  }
  return context;
}



// 1. Define the factory function with a generic T
// 1. Define the factory function with a generic T
export function createGenericContext<T extends Record<string, unknown>>() {
  // Initialize with undefined to handle missing providers safely
  const context = createContext<T | undefined>(undefined);

  // 2. Create a custom hook that ensures the context is used within a Provider
  const useGenericContext = () => {
    const c = useContext(context);
    if (c === undefined) {
      throw new Error("useGenericContext must be used within its Provider");
    }
    return c;
  };

  return [useGenericContext, context.Provider] as const;
}
