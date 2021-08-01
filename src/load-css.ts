import isArrayOrString from './internal/isArrayOrString';
import parseArgs from './internal/parseArgs';
import { AnyOption, MaybeArray } from './types';

/**
 * Load css file(s) asynchonously.

 * @returns Promise<void[]>
 */
export const loadCss = (
  ...args: (MaybeArray<string> | AnyOption)[]
): Promise<void[]> => {
  const option =
    args.length > 1 &&
    !isArrayOrString(args[args.length - 1]) &&
    <AnyOption>args.pop();

  const elementAttr = parseArgs(...args, {
    ...option,
    fileType: 'css',
  });
  const fjs = getFirstLink();
  const promises: Promise<void>[] = [];

  elementAttr.forEach(({ src }) => {
    if (!document.querySelector(`[href="${src}"]`)) {
      const link = createElement(document, 'link', src);
      fjs.parentNode.insertBefore(link, fjs);
      const promise: Promise<void> = new Promise((resolve) => {
        link.onload = function onload() {
          resolve();
        };
      });
      promises.push(promise);
    }
  });

  return Promise.all(promises);
};

function createElement(d, s, href) {
  const link = d.createElement(s);
  link.href = href;
  link.rel = 'stylesheet';
  return link;
}

const getFirstLink = (): HTMLLinkElement => {
  const firstLink = document.getElementsByTagName('link')[0];
  if (firstLink) {
    return firstLink;
  }
  const link = document.createElement('link');
  document.body.appendChild(link);
  return link;
};
