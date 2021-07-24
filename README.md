# Load Assets

Utilities to load assets asynchonously: javascript, css, images,...

## Motivation
I am a fan of using javascript libraries from their CDN rather than include them in our application bundle. If you are building application with React.js, Angular, Vue.js, there are many wrapper of libraries you need. But it causes a problem called `bio-conflict` (that's what I call it) when you upgrade your framework to latest version. Moreover, some javascript libraries doesn't support npm installation, or you just want to load it as lazy way (when user reach a specific page).

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
import loadAsyncJs from 'load-assets/load-async-js';

loadAsyncJs(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
).then(() => {
  // Lodash available here.
});
```

## API

- **loadAsyncJs**: Load one or more javascript file(s) from cdn or external sources.
- **loadAsyncCss**: Load one or more css file(s) from cdn or external sources.
- **loadAsyncImage**: Load one or more image(s) from cdn or external sources.