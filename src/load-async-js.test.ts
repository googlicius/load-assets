/**
 * @jest-environment jsdom
 */

import { loadAsyncJs } from './load-async-js';

describe('Test load async js', () => {
  document.body.innerHTML = `<div></div>`;

  test('External lib loaded and initialized globaly', (done) => {
    loadAsyncJs(
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js',
    ).then(() => {
      expect(window['tns']).toBeTruthy();
      done();
    });
  });

  test('Load 2 external libs as same times', async () => {
    document.body.innerHTML = `<div></div>`;

    await loadAsyncJs([
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
      'https://connect.facebook.net/en_US/sdk.js',
    ]);

    expect(window['_']).toBeTruthy();
    expect(window['FB']).toBeTruthy();
  });

  test('Load 1 external lib when given same urls', async () => {
    document.body.innerHTML = `<div></div>`;

    const scriptUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js';

    await loadAsyncJs([scriptUrl, scriptUrl, scriptUrl]);
    const scriptEls = document.querySelectorAll(`[src="${scriptUrl}"]`);

    expect(window['tns']).toBeTruthy();
    expect(scriptEls.length).toEqual(1);
  });

  test('One external lib load many times, but initialize only once.', async () => {
    document.body.innerHTML = `<div></div>`;

    const scriptUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';

    await Promise.all([
      loadAsyncJs(scriptUrl),
      loadAsyncJs(scriptUrl),
      loadAsyncJs(scriptUrl),
    ]);
    await loadAsyncJs(scriptUrl);
    await loadAsyncJs(scriptUrl);

    const scriptEls = document.querySelectorAll(`[src="${scriptUrl}"]`);

    expect(window['_']).toBeTruthy();
    expect(scriptEls.length).toEqual(1);
  });
});
