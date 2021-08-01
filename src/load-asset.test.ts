/**
 * @jest-environment jsdom
 */

import { loadAsset } from './load-asset';

describe('Load Asset test', () => {
  test('Load external library with its css and js files', (done) => {
    const cssUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.3/tiny-slider.css';
    const jsUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js';

    loadAsset(cssUrl, cssUrl, jsUrl).then(() => {
      const linkElements = document.querySelectorAll(`[href="${cssUrl}"]`);
      expect(window['tns']).toBeTruthy();
      expect(linkElements.length).toEqual(1);
      done();
    });
  });
});
