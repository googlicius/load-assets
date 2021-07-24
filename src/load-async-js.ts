type LoadState = 'not-loaded' | 'loading' | 'loaded';

const getScriptState = (url: string): LoadState => {
  const scriptEl = document.querySelector(`[src="${url}"]`);
  return !scriptEl
    ? 'not-loaded'
    : <LoadState>scriptEl.getAttribute('load-state') || 'loaded';
};

const getFirstScript = () => {
  const fjs = document.getElementsByTagName('script')[0];
  if (!fjs) {
    const js = document.createElement('script');
    document.body.appendChild(js);
    return js;
  }
  return fjs;
};

/**
 * Load js file(s) asynchonously.
 *
 * @param url url(s) of JS file(s)
 * @returns Promise<void[]>
 */
export const loadAsyncJS = (url: string | string[]): Promise<void[]> => {
  const fjs = getFirstScript();
  const promises: Promise<void>[] = [];

  if (typeof url === 'string') {
    url = [url];
  }

  url.forEach((urlStr) => {
    let jsEl: HTMLScriptElement;
    const state = getScriptState(urlStr);

    if (state === 'loaded') {
      return;
    }

    if (state === 'loading') {
      jsEl = document.querySelector(`[src="${urlStr}"]`);
    } else {
      jsEl = document.createElement('script');
      jsEl.src = urlStr;
      jsEl.setAttribute('load-state', 'loading');
      fjs.parentNode.insertBefore(jsEl, fjs);
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
