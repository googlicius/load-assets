import isArrayOrString from './internal/isArrayOrString';
import parseArgs from './internal/parseArgs';
import { AnyOption, MaybeArray, ElementAttr } from './types';

type LoadState = 'not-loaded' | 'loading' | 'loaded';

/**
 * Load js file(s) async/defer.
 *
 * @returns Promise<void[]>
 */
export const loadScript = (
  ...args: (MaybeArray<string> | AnyOption)[]
): Promise<void[]> => {
  const option =
    args.length > 1 &&
    !isArrayOrString(args[args.length - 1]) &&
    <AnyOption>args.pop();

  const scriptAttrs: ElementAttr[] = parseArgs(...args, {
    ...option,
    fileType: 'js',
  });
  const fjs: HTMLScriptElement = getFirstScript();
  const promises: Promise<void>[] = [];

  scriptAttrs.forEach(({ url, async, ...rest }) => {
    let jsEl: HTMLScriptElement = document.querySelector(`[src="${url}"]`);
    const state: LoadState = !jsEl
      ? 'not-loaded'
      : <LoadState>jsEl.getAttribute('load-state') || 'loaded';

    switch (state) {
      case 'loaded':
        return;

      case 'loading':
        break;

      default:
        jsEl = document.createElement('script');
        jsEl.src = url;
        jsEl.async = async;
        if (rest) {
          for (const key in rest) {
            if (Object.prototype.hasOwnProperty.call(rest, key)) {
              jsEl.setAttribute(key, rest[key]);
            }
          }
        }
        jsEl.setAttribute('load-state', 'loading');
        fjs.parentNode.insertBefore(jsEl, fjs);
        break;
    }

    promises.push(
      new Promise((resolve) => {
        addOnloadHandler(jsEl, () => {
          jsEl.setAttribute('load-state', 'loaded');
          resolve();
        });
      }),
    );
  });

  return Promise.all(promises);
};

const getFirstScript = () => {
  const fjs = document.getElementsByTagName('script')[0];
  if (fjs) {
    return fjs;
  }
  const js = document.createElement('script');
  document.body.appendChild(js);
  return js;
};

/**
 * Method to add one or more function handler on an element's onload event
 * This is because onload cannot carry out many separate functions.
 *
 * @export
 * @param element DOM element
 * @param handler function
 */
const addOnloadHandler = (element, handler) => {
  if (typeof element.onload === 'function') {
    const preFunc = element.onload;
    element.onload = () => {
      preFunc();
      handler();
    };
  } else {
    element.onload = handler;
  }
};
