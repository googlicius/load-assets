function createElement(d, s, href) {
  const link = d.createElement(s);
  link.href = href;
  link.rel = 'stylesheet';
  return link;
}

export const loadAsyncCss = (href: string | Array<string>): Promise<void>[] => {
  const fjs = document.getElementsByTagName('link')[0];
  const promises: Promise<void>[] = [];

  if (typeof href === 'string') {
    href = [href];
  }

  href.forEach((hrefStr) => {
    if (!document.querySelector(`[href="${hrefStr}"]`)) {
      const link = createElement(document, 'link', hrefStr);
      fjs.parentNode.insertBefore(link, fjs);
      const promise: Promise<void> = new Promise((resolve) => {
        link.onload = function onload() {
          resolve();
        };
      });
      promises.push(promise);
    }
  });

  return promises;
};
