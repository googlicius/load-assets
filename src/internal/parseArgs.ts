import { AnyOption, MaybeArray, ElementAttr } from '../types';
import isArrayOrString from './isArrayOrString';

function getExt(filepath) {
  return filepath.split('?')[0].split('#')[0].split('.').pop();
}

/**
 * Parse rest parameters to expected format.
 */
export default function parseArgs(
  ...args: (MaybeArray<string> | AnyOption)[]
): ElementAttr[] {
  const option =
    args.length > 1 && !isArrayOrString(args[args.length - 1])
      ? <AnyOption>args.pop()
      : {};
  const { fileType, ...rest } = option;

  const result: ElementAttr[] = [];

  for (let i = 0; i < args.length; i++) {
    const url = args[i];

    if (!isArrayOrString(url)) {
      throw new Error(
        'Invalid type, url must be a string or array of strings.',
      );
    }

    const urls = typeof url === 'string' ? [url] : (url as string[]);

    urls.forEach((url) => {
      // Ignore unmatched extension.
      if (fileType && getExt(url) !== fileType) {
        return;
      }

      let elAttr: ElementAttr = {
        url,
        async: true,
      };

      if (urls.length > 1) {
        elAttr.async = false;
      }

      elAttr = Object.assign({}, rest, elAttr);

      result.push(elAttr);
    });
  }

  return result;
}
