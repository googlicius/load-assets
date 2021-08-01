import { AnyOption, MaybeArray } from '../types';

interface ScriptAttr {
  src: string;
  async: boolean;
  [x: string]: any;
}

function isArrayOrString(value: any) {
  return typeof value === 'string' || Array.isArray(value);
}

/**
 * Parse rest parameters to expected format.
 */
export default function parseArgs(
  ...args: (MaybeArray<string> | AnyOption)[]
): ScriptAttr[] {
  const option =
    args.length > 1 &&
    !isArrayOrString(args[args.length - 1]) &&
    <AnyOption>args.pop();

  const result: ScriptAttr[] = [];

  for (let i = 0; i < args.length; i++) {
    const url = args[i];

    if (!isArrayOrString(url)) {
      throw new Error(
        'Invalid type, url must be a string or array of strings.',
      );
    }

    const srcs = typeof url === 'string' ? [url] : (url as string[]);

    srcs.forEach((src) => {
      let scriptAttr: ScriptAttr = {
        src,
        async: true,
      };

      if (srcs.length > 1) {
        scriptAttr.async = false;
      }

      if (option) {
        scriptAttr = Object.assign({}, option, scriptAttr);
      }

      result.push(scriptAttr);
    });
  }

  return result;
}
