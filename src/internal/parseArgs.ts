import { AnyOption, MaybeArray, ScriptAttr } from '../types';
import isArrayOrString from './isArrayOrString';

function getExt(filepath) {
  return filepath.split('?')[0].split('#')[0].split('.').pop();
}

/**
 * Parse rest parameters to expected format.
 */
export default function parseArgs(
  ...args: (MaybeArray<string> | AnyOption)[]
): ScriptAttr[] {
  const option =
    args.length > 1 && !isArrayOrString(args[args.length - 1])
      ? <AnyOption>args.pop()
      : {};
  const { fileType, ...rest } = option;

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
      // Ignore unmatched extension.
      if (fileType && getExt(src) !== fileType) {
        return;
      }

      let scriptAttr: ScriptAttr = {
        src,
        async: true,
      };

      if (srcs.length > 1) {
        scriptAttr.async = false;
      }

      scriptAttr = Object.assign({}, rest, scriptAttr);

      result.push(scriptAttr);
    });
  }

  return result;
}
