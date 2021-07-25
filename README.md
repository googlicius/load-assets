# Load Assets

Utilities to load assets asynchonously: javascript, css, images,...

## Motivation

I am a fan of using javascript libraries from their CDN rather than include them in our application bundle. If you are building application with React.js, Angular, Vue.js, there are many wrapper of libraries you need. But it causes a problem called [`bi-incompatible`](#two-way-incompatible) (that's what I call it) when you upgrade your framework to latest version. Some javascript libraries doesn't support npm installation, or you just want to load it as lazy way (when user reach a specific page).

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
import { loadAsyncJs } from '@googlicius/load-assets';

loadAsyncJs(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
).then(() => {
  // Lodash available here.
});
```

Load 2 javascript files as same times

```javascript
loadAsyncJs([
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
  'https://connect.facebook.net/en_US/sdk.js',
]).then(() => {
  // Lodash and Facebook SDK available here.
});
```

## API

- **loadAsyncJs**: Load one or more javascript file(s) from cdn or external sources.
- **loadAsyncCss**: Load one or more css file(s) from cdn or external sources.
- **loadAsyncImage**: Load one or more image(s) from cdn or external sources.

## License

MIT

---

## Two-way incompatible

When you upgradge your framework to higher version, but that version possibly incompatible with some library wrappers in your project, or you want to use the latest version of a library but it possibly haven't supported. For example, Reactstrap currently support Bootstrap 4, so you cannot use Bootstrap 5 at this time.
