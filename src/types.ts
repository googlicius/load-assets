export type MaybeArray<T> = T | T[];

export interface AnyOption {
  [x: string]: any;
  fileType?: string;
}

export interface ScriptAttr {
  src: string;
  async: boolean;
  [x: string]: any;
}
