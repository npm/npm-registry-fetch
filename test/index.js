'use strict'

const Buffer = require('safe-buffer').Buffer

const npmlog = require('npmlog')
const PassThrough = require('stream').PassThrough
const silentLog = require('../silentlog.js')
const ssri = require('ssri')
const test = require('tap').test
const tnock = require('./util/tnock.js')
const zlib = require('zlib')

const fetch = require('../index.js')

npmlog.level = process.env.LOGLEVEL || 'silent'
const OPTS = {
  log: npmlog,
  timeout: 0,
  retry: {
    retries: 1,
    factor: 1,
    minTimeout: 1,
    maxTimeout: 10
  },
  registry: 'https://mock.reg/'
}

test('hello world', t => {
  tnock(t, OPTS.registry)
    .get('/hello')
    .reply(200, {hello: 'world'})
  return fetch('/hello', OPTS)
    .then(res => {
      t.equal(res.status, 200, 'got successful response')
      return res.json()
    })
    .then(json => t.deepEqual(json, {hello: 'world'}, 'got correct body'))
})

test('JSON body param', t => {
  tnock(t, OPTS.registry)
    .matchHeader('content-type', ctype => {
      t.equal(ctype[0], 'application/json', 'content-type automatically set')
      return ctype[0] === 'application/json'
    })
    .post('/hello')
    .reply(200, (uri, reqBody) => {
      t.deepEqual(reqBody, {
        hello: 'world'
      }, 'got the JSON version of the body')
      return reqBody
    })
  const opts = Object.assign({
    method: 'POST',
    body: {hello: 'world'}
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200)
      return res.json()
    })
    .then(json => t.deepEqual(json, {hello: 'world'}))
})

test('buffer body param', t => {
  tnock(t, OPTS.registry)
    .matchHeader('content-type', ctype => {
      t.equal(ctype[0], 'application/octet-stream', 'content-type automatically set')
      return ctype[0] === 'application/octet-stream'
    })
    .post('/hello')
    .reply(200, (uri, reqBody) => {
      t.deepEqual(
        Buffer.from(reqBody, 'utf8'),
        Buffer.from('hello', 'utf8'),
        'got the JSON version of the body'
      )
      return reqBody
    })
  const opts = Object.assign({
    method: 'POST',
    body: Buffer.from('hello', 'utf8')
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200)
      return res.buffer()
    })
    .then(buf =>
      t.deepEqual(buf, Buffer.from('hello', 'utf8'), 'got response')
    )
})

test('stream body param', t => {
  tnock(t, OPTS.registry)
    .matchHeader('content-type', ctype => {
      t.equal(ctype[0], 'application/octet-stream', 'content-type automatically set')
      return ctype[0] === 'application/octet-stream'
    })
    .post('/hello')
    .reply(200, (uri, reqBody) => {
      t.deepEqual(JSON.parse(reqBody), {
        hello: 'world'
      }, 'got the stringified version of the body')
      return reqBody
    })
  const stream = new PassThrough()
  setImmediate(() => stream.end(JSON.stringify({hello: 'world'})))
  const opts = Object.assign({
    method: 'POST',
    body: stream
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200)
      return res.json()
    })
    .then(json => t.deepEqual(json, {hello: 'world'}))
})

test('JSON body param', t => {
  tnock(t, OPTS.registry)
    .matchHeader('content-type', ctype => {
      t.equal(ctype[0], 'application/json', 'content-type automatically set')
      return ctype[0] === 'application/json'
    })
    .matchHeader('content-encoding', enc => {
      t.equal(enc[0], 'gzip', 'content-encoding automatically set')
      return enc[0] === 'gzip'
    })
    .post('/hello')
    // NOTE: can't really test the body itself here because nock freaks out.
    .reply(200)
  const opts = Object.assign({
    method: 'POST',
    body: {hello: 'world'},
    gzip: true
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200, 'request succeeded')
    })
})

test('gzip + buffer body param', t => {
  tnock(t, OPTS.registry)
    .matchHeader('content-type', ctype => {
      t.equal(ctype[0], 'application/octet-stream', 'content-type automatically set')
      return ctype[0] === 'application/octet-stream'
    })
    .matchHeader('content-encoding', enc => {
      t.equal(enc[0], 'gzip', 'content-encoding automatically set')
      return enc[0] === 'gzip'
    })
    .post('/hello')
    .reply(200, (uri, reqBody) => {
      reqBody = zlib.gunzipSync(Buffer.from(reqBody, 'hex'))
      t.deepEqual(
        Buffer.from(reqBody, 'utf8').toString('utf8'),
        'hello',
        'got the JSON version of the body'
      )
      return reqBody
    })
  const opts = Object.assign({
    method: 'POST',
    body: Buffer.from('hello', 'utf8'),
    gzip: true
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200)
      return res.buffer()
    })
    .then(buf =>
      t.deepEqual(buf, Buffer.from('hello', 'utf8'), 'got response')
    )
})

test('gzip + stream body param', t => {
  tnock(t, OPTS.registry)
    .matchHeader('content-type', ctype => {
      t.equal(ctype[0], 'application/octet-stream', 'content-type automatically set')
      return ctype[0] === 'application/octet-stream'
    })
    .matchHeader('content-encoding', enc => {
      t.equal(enc[0], 'gzip', 'content-encoding automatically set')
      return enc[0] === 'gzip'
    })
    .post('/hello')
    .reply(200, (uri, reqBody) => {
      reqBody = zlib.gunzipSync(Buffer.from(reqBody, 'hex'))
      t.deepEqual(JSON.parse(reqBody.toString('utf8')), {
        hello: 'world'
      }, 'got the stringified version of the body')
      return reqBody
    })
  const stream = new PassThrough()
  setImmediate(() => stream.end(JSON.stringify({hello: 'world'})))
  const opts = Object.assign({
    method: 'POST',
    body: stream,
    gzip: true
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200)
      return res.json()
    })
    .then(json => t.deepEqual(json, {hello: 'world'}))
})

test('query strings', t => {
  tnock(t, OPTS.registry)
    .get('/hello?hi=there&who=wor%20ld')
    .reply(200, {hello: 'world'})
  return fetch.json('/hello?hi=there', Object.assign({
    query: {who: 'wor ld'}
  }, OPTS))
    .then(json => t.equal(json.hello, 'world', 'query-string merged'))
})

test('query strings - undefined values', t => {
  tnock(t, OPTS.registry)
    .get('/hello?who=wor%20ld')
    .reply(200, {ok: true})
  return fetch.json('/hello', Object.assign({
    query: {hi: undefined, who: 'wor ld'}
  }, OPTS))
    .then(json => t.ok(json.ok, 'undefined keys not included in query string'))
})

test('json()', t => {
  tnock(t, OPTS.registry)
    .get('/hello')
    .reply(200, {hello: 'world'})
  return fetch.json('/hello', OPTS)
    .then(json => t.deepEqual(json, {hello: 'world'}, 'got json body'))
})

test('method configurable', t => {
  tnock(t, OPTS.registry)
    .delete('/hello')
    .reply(200)
  const opts = Object.assign({
    method: 'DELETE'
  }, OPTS)
  return fetch('/hello', opts)
    .then(res => {
      t.equal(res.status, 200, 'successfully used DELETE method')
    })
})

test('npm-notice header logging', t => {
  tnock(t, OPTS.registry)
    .get('/hello')
    .reply(200, {hello: 'world'}, {
      'npm-notice': 'npm <3 u'
    })
  const opts = Object.assign({}, OPTS, {
    log: Object.assign({}, silentLog, {
      notice (header, msg) {
        t.equal(header, '', 'empty log header thing')
        t.equal(msg, 'npm <3 u', 'logged out npm-notice at NOTICE level')
      }
    })
  })
  t.plan(3)
  return fetch('/hello', opts)
    .then(res => t.equal(res.status, 200, 'got successful response'))
})

test('optionally verifies request body integrity', t => {
  t.plan(3)
  tnock(t, OPTS.registry)
    .get('/hello')
    .times(2)
    .reply(200, 'hello')
  const integrity = ssri.fromData('hello')
  return fetch('/hello', Object.assign({integrity}, OPTS))
    .then(res => res.buffer())
    .then(buf => t.equal(
      buf.toString('utf8'), 'hello', 'successfully got the right data')
    )
    .then(() => {
      return fetch('/hello', Object.assign({integrity: 'sha1-nope'}, OPTS))
        .then(res => {
          t.ok(res.body, 'no error until body starts getting read')
          return res
        })
        .then(res => res.buffer())
        .then(
          () => { throw new Error('should not have succeeded') },
          err => t.equal(err.code, 'EINTEGRITY', 'got EINTEGRITY error')
        )
    })
})

test('pickRegistry() utility', t => {
  const pick = fetch.pickRegistry
  t.equal(pick('foo@1.2.3'), 'https://registry.npmjs.org/', 'has good default')
  t.equal(
    pick('foo@1.2.3', {
      registry: 'https://my.registry/here/',
      scope: '@otherscope',
      '@myscope:registry': 'https://my.scoped.registry/here/'
    }),
    'https://my.registry/here/',
    'unscoped package uses `registry` setting'
  )
  t.equal(
    pick('@user/foo@1.2.3', {
      registry: 'https://my.registry/here/',
      scope: '@myscope',
      '@myscope:registry': 'https://my.scoped.registry/here/'
    }),
    'https://my.scoped.registry/here/',
    'scoped package uses `@<scope>:registry` setting'
  )
  t.equal(
    pick('@user/foo@1.2.3', {
      registry: 'https://my.registry/here/',
      scope: 'myscope',
      '@myscope:registry': 'https://my.scoped.registry/here/'
    }),
    'https://my.scoped.registry/here/',
    'scope @ is option@l'
  )
  t.done()
})

test('pickRegistry through opts.spec', t => {
  tnock(t, OPTS.registry)
    .get('/pkg')
    .reply(200, {source: OPTS.registry})
  const scopedReg = 'https://scoped.mock.reg/'
  tnock(t, scopedReg)
    .get('/pkg')
    .times(2)
    .reply(200, {source: scopedReg})
  return fetch.json('/pkg', Object.assign({
    spec: 'pkg@1.2.3',
    '@myscope:registry': scopedReg
  }, OPTS))
    .then(json => t.equal(
      json.source,
      OPTS.registry,
      'request made to main registry'
    ))
    .then(() => fetch.json('/pkg', Object.assign({
      spec: 'pkg@1.2.3',
      '@myscope:registry': scopedReg,
      'scope': '@myscope'
    })))
    .then(json => t.equal(
      json.source,
      scopedReg,
      'request made to scope registry using opts.scope'
    ))
    .then(() => fetch.json('/pkg', Object.assign({
      spec: '@myscope/pkg@1.2.3',
      '@myscope:registry': scopedReg
    })))
    .then(json => t.equal(
      json.source,
      scopedReg,
      'request made to scope registry using spec scope'
    ))
})

// TODO
// * npm-session
// * npm-in-ci
// * npm-scope
// * referer (opts.refer)
// * user-agent
test('miscellaneous headers')
