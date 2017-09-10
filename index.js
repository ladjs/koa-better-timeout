const Boom = require('boom');

// inspired by `koa-timeout`
// and refactored for async

class Timeout {
  constructor(config) {
    this.config = Object.assign(
      {
        ms: 6000,
        message: Boom.clientTimeout().message,
        sendResponse: Boom.clientTimeout
      },
      config
    );
    if (typeof this.config.ms !== 'number')
      throw new Error('timeout `ms` was not a number');
    if (typeof this.config.message !== 'string')
      throw new Error('timeout `message` was not a string');
    if (typeof this.config.sendResponse !== 'function')
      throw new Error('timeout `sendResponse` function is missing');
  }
  middleware(ctx, next) {
    ctx.req._timeout = null;

    return Promise.race([
      new Promise((resolve, reject) => {
        ctx.req._timeout = setTimeout(() => {
          reject(this.config.sendResponse(this.config.message));
        }, this.config.ms);
      }),
      new Promise(async (resolve, reject) => {
        try {
          await next();
          clearTimeout(ctx.req._timeout);
          resolve();
        } catch (err) {
          clearTimeout(ctx.req._timeout);
          reject(err);
        }
      })
    ]);
  }
}

module.exports = Timeout;
