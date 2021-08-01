import parseArgs from './parse-args';

describe('Parse Args test', () => {
  test('Args is single string', () => {
    const url = 'https://example.com/assets/prism.js';

    expect(parseArgs(url)).toEqual([
      {
        src: url,
        async: true,
      },
    ]);
  });

  test('Args is a series of strings', () => {
    const url = 'https://example.com/assets/prism.js';
    const url2 = 'https://example.com/assets/lodash.js';

    expect(parseArgs(url, url2)).toEqual([
      {
        async: true,
        src: url,
      },
      {
        async: true,
        src: url2,
      },
    ]);
  });

  test('Args is array of strings', () => {
    const url = 'https://example.com/assets/prism.js';
    const url2 = 'https://example.com/assets/lodash.js';

    expect(parseArgs([url, url2])).toEqual([
      {
        src: url,
        async: false,
      },
      {
        src: url2,
        async: false,
      },
    ]);
  });

  test('Args is mixed of series arrays and strings and option', () => {
    const url = 'https://example.com/assets/facebook-sdk.js';
    const url1 = 'https://example.com/assets/prism.js';
    const url2 = 'https://example.com/assets/prism.autoload.js';
    const url3 = 'https://example.com/assets/lodash.js';
    const urls = [url1, url2];
    const option = {
      'data-my-attr': 'hey',
    };

    const res = parseArgs(url, urls, url3, option);

    expect(res).toEqual([
      {
        'data-my-attr': 'hey',
        src: url,
        async: true,
      },
      {
        'data-my-attr': 'hey',
        src: url1,
        async: false,
      },
      {
        'data-my-attr': 'hey',
        src: url2,
        async: false,
      },
      {
        'data-my-attr': 'hey',
        src: url3,
        async: true,
      },
    ]);
  });

  test('Thown error is option is not last argument', () => {
    const url = 'https://example.com/assets/prism.js';
    const url2 = 'https://example.com/assets/lodash.js';
    const option = {
      'data-manual': '1',
    };

    expect(() => {
      parseArgs(url, option, url2);
    }).toThrowError('Invalid type, url must be a string or array of strings.');
  });
});
