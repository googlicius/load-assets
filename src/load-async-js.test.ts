/**
 * @jest-environment jsdom
 */

import { loadAsyncJS } from './load-async-js';

describe('Test load async js', () => {
  document.body.innerHTML = `<div></div>`;

  test('External lib loaded and initialized globaly', (done) => {
    loadAsyncJS(
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js',
    ).then(() => {
      expect(window['tns']).toBeTruthy();
      done();
    });
  });

  test('Load 2 external libs as same times', async () => {
    document.body.innerHTML = `<div></div>`;

    await loadAsyncJS([
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js',
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
    ]);

    expect(window['tns']).toBeTruthy();
    expect(window['_']).toBeTruthy();
  });

  test('Load 1 external lib when given same urls', async () => {
    document.body.innerHTML = `<div></div>`;

    const scriptUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js';

    await loadAsyncJS([scriptUrl, scriptUrl, scriptUrl]);
    const scriptEls = document.querySelectorAll(`[src="${scriptUrl}"]`);

    expect(window['tns']).toBeTruthy();
    expect(scriptEls.length).toEqual(1);
  });

  test('One external lib load many times, but initialize only once.', async () => {
    document.body.innerHTML = `<div></div>`;

    const scriptUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';

    await Promise.all([
      loadAsyncJS(scriptUrl),
      loadAsyncJS(scriptUrl),
      loadAsyncJS(scriptUrl),
    ]);
    await loadAsyncJS(scriptUrl);
    await loadAsyncJS(scriptUrl);

    const scriptEls = document.querySelectorAll(`[src="${scriptUrl}"]`);

    expect(window['_']).toBeTruthy();
    expect(scriptEls.length).toEqual(1);
  });
});
