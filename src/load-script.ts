import parseArgs from './innternal/parse-args';
import { AnyOption, MaybeArray } from './types';

type LoadState = 'not-loaded' | 'loading' | 'loaded';

/**
 * Load js file(s) async/defer.
 *
 * @param url url(s) of JS file(s)
 * @returns Promise<void[]>
 */
export const loadScript = (
  ...args: (MaybeArray<string> | AnyOption)[]
): Promise<void[]> => {
  const scriptAttrs = parseArgs(...args);
  const fjs = getFirstScript();
  const promises: Promise<void>[] = [];

  scriptAttrs.forEach(({ src, async, ...rest }) => {
    let jsEl: HTMLScriptElement;
    const state = getScriptState(src);

    switch (state) {
      case 'loaded':
        return;

      case 'loading':
        jsEl = document.querySelector(`[src="${src}"]`);
        break;

      default:
        jsEl = document.createElement('script');
        jsEl.src = src;
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

    const promise: Promise<void> = new Promise((resolve) => {
      addOnloadHandler(jsEl, () => {
        jsEl.setAttribute('load-state', 'loaded');
        resolve();
      });
    });
    promises.push(promise);
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

const getScriptState = (url: string): LoadState => {
  const scriptEl = document.querySelector(`[src="${url}"]`);
  return !scriptEl
    ? 'not-loaded'
    : <LoadState>scriptEl.getAttribute('load-state') || 'loaded';
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
