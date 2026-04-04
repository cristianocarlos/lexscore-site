import {createSelector} from 'reselect';

export const getObjectLength = createSelector(
  [
    (value?: unknown) => {
      return value;
    },
  ],
  (value?: unknown) => {
    return value instanceof Object ? Object.keys(value).length : 0;
  },
);

export const getArrayLength = createSelector(
  [
    (value?: unknown) => {
      return value;
    },
  ],
  (value?: unknown) => {
    return Array.isArray(value) ? value.length : 0;
  },
);
