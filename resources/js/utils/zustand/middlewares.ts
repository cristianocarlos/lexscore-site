import {diff} from 'deep-object-diff';

import type {StateCreator} from 'zustand';

type TLogger = <G>(fn: StateCreator<G>) => StateCreator<G>;

const showZustandLog = false;

export const formigoLogger: TLogger = (fn) => (set, get, api) => {
  return fn(
    (args) => {
      if (showZustandLog) {
        // @ts-expect-error zustand logger data desconhecido
        const currentData = get().data?.attr;
        set(args);
        // @ts-expect-error zustand logger data desconhecido
        const nextData = get().data?.attr;
        const diffData = diff(currentData, nextData);
        if (currentData && Object.keys(diffData).length > 0) {
          console.groupCollapsed('%cZ', 'color: orange;');
          console.log('%cC', 'color: gray;', currentData);
          console.log('%c', 'color: green;', diffData);
          console.log('%cN', 'color: gray;', nextData);
          console.trace();
          console.groupEnd();
        }
      } else {
        set(args);
      }
    },
    get,
    api,
  );
};

export const defaultLogger: TLogger = (fn) => (set, get, api) => {
  return fn(
    (args) => {
      if (showZustandLog) {
        // @ts-expect-error zustand logger data desconhecido
        const currentData = get().data;
        set(args);
        // @ts-expect-error zustand logger data desconhecido
        const nextData = get().data;
        const diffData = diff(currentData, nextData);
        if (currentData && Object.keys(diffData).length > 0) {
          console.groupCollapsed('%cZ', 'color: orange;');
          console.log('%cC', 'color: gray;', currentData);
          console.log('%c', 'color: green;', diffData);
          console.log('%cN', 'color: gray;', nextData);
          console.trace();
          console.groupEnd();
        }
      } else {
        set(args);
      }
    },
    get,
    api,
  );
};
