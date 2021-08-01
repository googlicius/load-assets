import { loadCss } from './load-css';
import { loadScript } from './load-script';
import { AnyOption, MaybeArray } from './types';

/**
 * Load and initial assets based on its extension.
 */
export const loadAsset = (
  ...args: (MaybeArray<string> | AnyOption)[]
): Promise<void[]> => {
  const promises: Promise<any>[] = [];

  promises.push(loadCss(...args), loadScript(...args));

  return Promise.all(promises);
};
