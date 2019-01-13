# koa-better-timeout

[![build status](https://img.shields.io/travis/ladjs/koa-better-timeout.svg)](https://travis-ci.org/ladjs/koa-better-timeout)
[![code coverage](https://img.shields.io/codecov/c/github/ladjs/koa-better-timeout.svg)](https://codecov.io/gh/ladjs/koa-better-timeout)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/ladjs/koa-better-timeout.svg)](<>)

> Response timeout middleware for [Koa][] and [Lad][] (uses [Boom][] by default)


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Options](#options)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install koa-better-timeout
```

[yarn][]:

```sh
yarn add koa-better-timeout
```


## Usage

> Default middleware usage:

```js
const Timeout = require('koa-better-timeout');

// ...

const timeout = new Timeout();
app.use(timeout.middleware);
```

> Advanced middleware usage (e.g. using [Lad][] and its [@ladjs/i18n][ladjs-i18n] middleware) with translated response message:

```js
const Timeout = require('koa-better-timeout');

// ...

const timeout = new Timeout({
  message: ctx => ctx.translate('REQUEST_TIMED_OUT')
});
app.use(timeout.middleware);
```


## Options

You can optionally pass an object of options to `Timeout(opts)`.

The default option values use [Boom][] and are:

```js
{
  ms: 6000,
  message: Boom.clientTimeout().message,
  sendResponse: Boom.clientTimeout
}
```

Note that `message` can be a function that accepts one argument `ctx`.  This is useful if you wish to use i18n translation for the response message.


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[lad]: https://lad.js.org

[boom]: https://github.com/hapijs/boom

[ladjs-i18n]: https://github.com/ladjs/i18n

[koa]: http://koajs.com/
