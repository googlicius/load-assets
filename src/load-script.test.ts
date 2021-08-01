/**
 * @jest-environment jsdom
 */

import { loadScript } from './load-script';

describe('Test load async js', () => {
  document.body.innerHTML = `<div></div>`;

  test('External lib loaded and initialized globaly', (done) => {
    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js',
    ).then(() => {
      expect(window['tns']).toBeTruthy();
      done();
    });
  });

  test('External lib with attribute', (done) => {
    const url = 'https://connect.facebook.net/en_US/sdk.js';
    loadScript(url, {
      'data-run': 'manual',
    }).then(() => {
      const scriptEl = document.querySelector(`[src="${url}"]`);
      expect(window['FB']).toBeTruthy();
      expect(scriptEl.getAttribute('data-run')).toEqual('manual');
      done();
    });
  });

  test('Load 2 external libs as same times', async () => {
    document.body.innerHTML = `<div></div>`;

    await loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
      'https://connect.facebook.net/en_US/sdk.js',
    );

    expect(window['_']).toBeTruthy();
    expect(window['FB']).toBeTruthy();
  });

  test('Load 1 external lib when given same urls', async () => {
    document.body.innerHTML = `<div></div>`;

    const scriptUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js';

    await loadScript(scriptUrl, scriptUrl, scriptUrl);
    const scriptEls = document.querySelectorAll(`[src="${scriptUrl}"]`);

    expect(window['tns']).toBeTruthy();
    expect(scriptEls.length).toEqual(1);
  });

  test('One external lib load many times, but initialize only once.', async () => {
    document.body.innerHTML = `<div></div>`;

    const scriptUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';

    await Promise.all([
      loadScript(scriptUrl),
      loadScript(scriptUrl),
      loadScript(scriptUrl),
    ]);
    await loadScript(scriptUrl);
    await loadScript(scriptUrl);

    const scriptEls = document.querySelectorAll(`[src="${scriptUrl}"]`);

    expect(window['_']).toBeTruthy();
    expect(scriptEls.length).toEqual(1);
  });

  test('Load script defer', async () => {
    document.body.innerHTML = `<div></div>`;

    const url1 =
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js';
    const url2 =
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/plugins/autoloader/prism-autoloader.min.js';
    const url3 =
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';

    await loadScript([url1, url2], url3);

    const scriptEl1: HTMLScriptElement = document.querySelector(
      `[src="${url1}"]`,
    );
    const scriptEl2: HTMLScriptElement = document.querySelector(
      `[src="${url2}"]`,
    );
    const scriptEl3: HTMLScriptElement = document.querySelector(
      `[src="${url3}"]`,
    );

    expect(scriptEl1.async).toEqual(false);
    expect(scriptEl2.async).toEqual(false);
    expect(scriptEl3.async).toEqual(true);
  });
});
