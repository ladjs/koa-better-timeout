const test = require('ava');
const Boom = require('@hapi/boom');

const Timeout = require('..');

const next = () => {
  return new Promise(resolve => {
    resolve();
  });
};

test('returns itself', t => {
  t.true(new Timeout() instanceof Timeout);
});

test('sets a default config object', t => {
  const timeout = new Timeout();
  t.is(timeout.config.ms, 6000);
  t.is(timeout.config.message, Boom.clientTimeout().message);
  t.is(timeout.config.sendResponse, Boom.clientTimeout);
});

test('sets a custom message with ctx', async t => {
  const timeout = new Timeout({
    message: ctx => {
      t.true(typeof ctx === 'object');
      return 'Hello world';
    }
  });
  const ctx = { request: {} };
  const error = await t.throwsAsync(
    timeout.middleware(ctx, () => {
      return new Promise(resolve => {
        setTimeout(resolve, 7000);
      });
    })
  );
  t.true(ctx.request._timeout._called);
  t.is(error.message, 'Hello world');
});

test('times out and sends response', async t => {
  const timeout = new Timeout();
  const ctx = { request: {} };
  const error = await t.throwsAsync(
    timeout.middleware(ctx, () => {
      return new Promise(resolve => {
        setTimeout(resolve, 7000);
      });
    })
  );
  t.true(ctx.request._timeout._called);
  t.is(error.message, Boom.clientTimeout().message);
});

test('clears timeout after response', async t => {
  const timeout = new Timeout();
  const ctx = { request: {} };
  await timeout.middleware(ctx, next);
  t.false(ctx.request._timeout._called);
});

test('clears timeout after error', async t => {
  const timeout = new Timeout();
  const ctx = { request: {} };
  const error = await t.throwsAsync(
    timeout.middleware(ctx, () => {
      return Promise.reject(new Error('done'));
    })
  );
  t.false(ctx.request._timeout._called);
  t.is(error.message, 'done');
});

test('throws error if ms not a number', t => {
  const error = t.throws(() => {
    // eslint-disable-next-line no-new
    new Timeout({ ms: '' });
  });
  t.is(error.message, 'timeout `ms` was not a number');
});

test('throws error if message not a string', t => {
  const error = t.throws(() => {
    // eslint-disable-next-line no-new
    new Timeout({ message: false });
  });
  t.is(error.message, 'timeout `message` was not a string nor function');
});

test('throws error if sendResponse not a function', t => {
  const error = t.throws(() => {
    // eslint-disable-next-line no-new
    new Timeout({ sendResponse: '' });
  });
  t.is(error.message, 'timeout `sendResponse` function is missing');
});
