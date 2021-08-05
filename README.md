# Load Assets

Utilities to load assets programatically: javascript, css, images,...

## Motivation

I am a fan of using javascript libraries from their CDN rather than include them in the application bundle. If you are building application with React.js, Angular, or Vue.js, there are many wrapper of libraries you need. But it causes a problem called [`bi-incompatible`](#two-way-incompatible) (that's what I call it) when you upgrade your framework to latest version. Some javascript libraries doesn't support npm installation, or you just want to load it as lazy way (when user reach a specific page).

## Installation

```
npm install @googlicius/load-assets
```

Or Yarn

```
yarn add @googlicius/load-assets
```

## Usage

```javascript
import { loadScript } from '@googlicius/load-assets';

loadScript(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
).then(() => {
  // Lodash available here.
});
```

Loads and runs 2 javascript files in parallel.

```javascript
loadScript(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
  'https://connect.facebook.net/en_US/sdk.js',
).then(() => {
  // Lodash and Facebook SDK available here.
});
```

Load 2 javascript files in parallel but runs in order,
which means the second script depends on the first one.

```javascript
loadScript([
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/plugins/autoloader/prism-autoloader.min.js',
]).then(() => {
  // Prism initialized with its autoloader.
});
```

Often a library is not only have javascript but also with its own css file.
So to load css and js we simple use `loadAsset`:

```javascript
import loadAsset from '@googlicius/load-assets';

loadAsset(
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-twilight.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js',
).then(() => {
  // Prism initialized with its styles.
});
```

Load with custom attributes:

```javascript
loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js', {
  'data-manual': 'true',
}).then(() => {
  // ...
});
```

## API

- **loadScript**: Load one or more javascript file(s) from cdn or external sources.
- **loadCss**: Load one or more css file(s) from cdn or external sources.
- **loadImage**: Load one or more image(s) from cdn or external sources.
- **loadAsset**: Load any file type, based on file extension. This method is a combination of all api above.

## License

MIT

---

## Two-way incompatible

When you upgradge your framework to higher version, but that version possibly incompatible with some library wrappers in your project, or you want to use the latest version of a library but it possibly haven't supported. For example, Reactstrap currently support Bootstrap 4, so you cannot use Bootstrap 5 at this time.
