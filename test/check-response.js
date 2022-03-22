const { Readable } = require('stream')
const t = require('tap')

const checkResponse = require('../lib/check-response.js')
const errors = require('../lib/errors.js')
const registry = 'registry'
const startTime = Date.now()

class Body extends Readable {
  _read () {
    return ''
  }
}
class Headers {
  has () {}
  get () {}
  raw () {}
}
const mockFetchRes = {
  body: new Body(),
  buffer: () => Promise.resolve(),
  headers: new Headers(),
  status: 200,
}

t.test('any response error should be silent', t => {
  const res = Object.assign({}, mockFetchRes, {
    buffer: () => Promise.reject(new Error('ERR')),
    status: 400,
    url: 'https://example.com/',
  })

  t.rejects(checkResponse({
    method: 'get',
    res,
    registry,
    startTime,
    opts: { ignoreBody: true },
  }), errors.HttpErrorGeneral)
  t.end()
})

t.test('all checks are ok, nothing to report', t => {
  const res = Object.assign({}, mockFetchRes, {
    buffer: () => Promise.resolve(Buffer.from('ok')),
    status: 400,
    url: 'https://example.com/',
  })
  t.rejects(checkResponse({
    method: 'get',
    res,
    registry,
    startTime,
  }), errors.HttpErrorGeneral)
  t.end()
})

t.test('log x-fetch-attempts header value', async t => {
  const headers = new Headers()
  headers.get = header => header === 'x-fetch-attempts' ? 3 : undefined
  const res = Object.assign({}, mockFetchRes, {
    headers,
    status: 400,
  })
  t.plan(2)
  let msg
  process.on('log', (level, ...args) => {
    if (level === 'http') {
      ;[, msg] = args
    }
  })
  await t.rejects(checkResponse({
    method: 'get',
    res,
    registry,
    startTime,
  }))
  t.ok(msg.endsWith('attempt #3'), 'should log correct number of attempts')
})

t.test('log the url fetched', t => {
  const headers = new Headers()
  const EE = require('events')
  headers.get = header => undefined
  const res = Object.assign({}, mockFetchRes, {
    headers,
    status: 200,
    url: 'http://example.com/foo/bar/baz',
    body: new EE(),
  })
  t.plan(2)
  let header, msg
  process.on('log', (level, ...args) => {
    if (level === 'http') {
      ;[header, msg] = args
    }
  })
  checkResponse({
    method: 'get',
    res,
    registry,
    startTime,

  })
  res.body.emit('end')
  t.equal(header, 'fetch')
  t.match(msg, /^GET 200 http:\/\/example.com\/foo\/bar\/baz [0-9]+m?s/)
})

t.test('redact password from log', t => {
  const headers = new Headers()
  const EE = require('events')
  headers.get = header => undefined
  const res = Object.assign({}, mockFetchRes, {
    headers,
    status: 200,
    url: 'http://username:password@example.com/foo/bar/baz',
    body: new EE(),
  })
  t.plan(2)
  let header, msg
  process.on('log', (level, ...args) => {
    if (level === 'http') {
      ;[header, msg] = args
    }
  })
  checkResponse({
    method: 'get',
    res,
    registry,
    startTime,
  })
  res.body.emit('end')
  t.equal(header, 'fetch')
  t.match(msg, /^GET 200 http:\/\/username:\*\*\*@example.com\/foo\/bar\/baz [0-9]+m?s/)
})

t.test('redact well known token from log', t => {
  const headers = new Headers()
  const EE = require('events')
  headers.get = header => undefined
  const res = Object.assign({}, mockFetchRes, {
    headers,
    status: 200,
    url: `http://example.com/foo/bar/baz/npm_${'a'.repeat(36)}`,
    body: new EE(),
  })
  t.plan(2)
  let header, msg
  process.on('log', (level, ...args) => {
    if (level === 'http') {
      ;[header, msg] = args
    }
  })
  checkResponse({
    method: 'get',
    res,
    registry,
    startTime,
  })
  res.body.emit('end')
  t.equal(header, 'fetch')
  t.match(msg, /^GET 200 http:\/\/example.com\/foo\/bar\/baz\/npm_\*\*\* [0-9]+m?s/)
})

/* eslint-disable-next-line max-len */
const moreInfoUrl = 'https://github.com/npm/cli/wiki/No-auth-for-URI,-but-auth-present-for-scoped-registry'

t.test('report auth for registry, but not for this request', async t => {
  const res = Object.assign({}, mockFetchRes, {
    buffer: () => Promise.resolve(Buffer.from('ok')),
    status: 400,
    url: 'https://example.com/',
  })
  t.plan(3)
  let header, msg
  process.on('log', (level, ...args) => {
    if (level === 'warn') {
      ;[header, msg] = args
    }
  })
  await t.rejects(checkResponse({
    method: 'get',
    res,
    uri: 'https://example.com/',
    registry,
    startTime,
    auth: {
      scopeAuthKey: '//some-scope-registry.com/',
      auth: null,
      token: null,
    },
  }), errors.HttpErrorGeneral)
  t.equal(header, 'registry')
  t.equal(msg, `No auth for URI, but auth present for scoped registry.

URI: https://example.com/
Scoped Registry Key: //some-scope-registry.com/

More info here: ${moreInfoUrl}`)
})

t.test('logs the value of x-local-cache-status when set', t => {
  const headers = new Headers()
  const EE = require('events')
  headers.get = header => header === 'x-local-cache-status' ? 'hit' : undefined
  const res = Object.assign({}, mockFetchRes, {
    headers,
    status: 200,
    url: 'http://username:password@example.com/foo/bar/baz',
    body: new EE(),
  })
  t.plan(2)
  let header, msg
  process.on('log', (level, ...args) => {
    if (level === 'http') {
      ;[header, msg] = args
    }
  })
  checkResponse({
    method: 'get',
    res,
    registry,
    startTime,
  })
  res.body.emit('end')
  t.equal(header, 'fetch')
  t.match(
    msg,
    /^GET 200 http:\/\/username:\*\*\*@example.com\/foo\/bar\/baz [0-9]+m?s \(cache hit\)$/
  )
})
