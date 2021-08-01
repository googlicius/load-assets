export type MaybeArray<T> = T | T[];

export interface AnyOption {
  [x: string]: any;
}

/**
 * Url's element will initialize after dependOnUrl's element initialized.
 */
export interface DependUrl {
  url: string;
  dependOnUrl: string;
}
