const Boom = require('@hapi/boom');

// inspired by `koa-timeout`  and refactored for async

class Timeout {
  constructor(config) {
    this.config = {
      ms: 6000,
      message: Boom.clientTimeout().message,
      sendResponse: Boom.clientTimeout,
      ...config
    };
    if (typeof this.config.ms !== 'number')
      throw new Error('timeout `ms` was not a number');
    if (
      typeof this.config.message !== 'string' &&
      typeof this.config.message !== 'function'
    )
      throw new Error('timeout `message` was not a string nor function');
    if (typeof this.config.sendResponse !== 'function')
      throw new Error('timeout `sendResponse` function is missing');
    this.middleware = this.middleware.bind(this);
  }

  middleware(ctx, next) {
    ctx.request._timeout = null;
    ctx.request._timeoutCalled = false;
    return Promise.race([
      new Promise((resolve, reject) => {
        ctx.request._timeout = setTimeout(() => {
          ctx.request._timeoutCalled = true;
          reject(
            this.config.sendResponse(
              typeof this.config.message === 'function'
                ? this.config.message(ctx)
                : this.config.message
            )
          );
        }, this.config.ms);
      }),
      (async () => {
        try {
          await next();
          clearTimeout(ctx.request._timeout);
          return;
        } catch (err) {
          clearTimeout(ctx.request._timeout);
          throw err;
        }
      })()
    ]);
  }
}

module.exports = Timeout;
