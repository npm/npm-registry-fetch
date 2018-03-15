'use strict'

const Buffer = require('safe-buffer').Buffer

const npmlog = require('npmlog')
const PassThrough = require('stream').PassThrough
const silentLog = require('../silentlog.js')
const ssri = require('ssri')
const test = require('tap').test
const tnock = require('./util/tnock.js')

const fetch = require('../index.js')

function confFromObj (obj) {
  const conf = new Map()
  Object.keys(obj || {}).forEach(k => { conf.set(k, obj[k]) })
  return conf
}

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
  config: confFromObj({
    registry: 'https://mock.reg/'
  })
}

test('hello world', t => {
  tnock(t, OPTS.config.get('registry'))
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
  tnock(t, OPTS.config.get('registry'))
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
  tnock(t, OPTS.config.get('registry'))
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
  tnock(t, OPTS.config.get('registry'))
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

test('json()', t => {
  tnock(t, OPTS.config.get('registry'))
    .get('/hello')
    .reply(200, {hello: 'world'})
  return fetch.json('/hello', OPTS)
    .then(json => t.deepEqual(json, {hello: 'world'}, 'got json body'))
})

test('method configurable', t => {
  tnock(t, OPTS.config.get('registry'))
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
  tnock(t, OPTS.config.get('registry'))
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
  tnock(t, OPTS.config.get('registry'))
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
      config: new Map([
        ['registry', 'https://my.registry/here/'],
        ['scope', '@otherscope'],
        ['@myscope:registry', 'https://my.scoped.registry/here/']
      ])
    }),
    'https://my.registry/here/',
    'unscoped package uses `registry` setting'
  )
  t.equal(
    pick('@user/foo@1.2.3', {
      config: new Map([
        ['registry', 'https://my.registry/here/'],
        ['scope', '@myscope'],
        ['@myscope:registry', 'https://my.scoped.registry/here/']
      ])
    }),
    'https://my.scoped.registry/here/',
    'scoped package uses `@<scope>:registry` setting'
  )
  t.equal(
    pick('@user/foo@1.2.3', {
      config: new Map([
        ['registry', 'https://my.registry/here/'],
        ['scope', 'myscope'],
        ['@myscope:registry', 'https://my.scoped.registry/here/']
      ])
    }),
    'https://my.scoped.registry/here/',
    'scope @ is option@l'
  )
  t.throws(() => {
    pick('foo/bar#latest')
  }, /not a valid registry dependency spec/, 'only registry types supported')
  t.done()
})

// TODO
// * npm-session
// * npm-in-ci
// * npm-scope
// * referer (opts.refer)
// * user-agent
test('miscellaneous headers')
