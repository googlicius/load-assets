type LoadState = 'not-loaded' | 'loading' | 'loaded';

/**
 * Load js file(s) asynchonously.
 *
 * @param url url(s) of JS file(s)
 * @returns Promise<void[]>
 */
export const loadAsyncJs = (url: string | string[]): Promise<void[]> => {
  const fjs = getFirstScript();
  const promises: Promise<void>[] = [];

  if (typeof url === 'string') {
    url = [url];
  }

  url.forEach((urlStr) => {
    let jsEl: HTMLScriptElement;
    const state = getScriptState(urlStr);

    switch (state) {
      case 'loaded':
        return;

      case 'loading':
        jsEl = document.querySelector(`[src="${urlStr}"]`);
        break;

      default:
        jsEl = document.createElement('script');
        jsEl.src = urlStr;
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
