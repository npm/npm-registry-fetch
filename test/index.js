'use strict'

const Buffer = require('safe-buffer').Buffer

const npmlog = require('npmlog')
const PassThrough = require('stream').PassThrough
const test = require('tap').test
const tnock = require('./util/tnock.js')

// const testDir = require('./util/test-dir.js')(__filename)

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

test('pickRegistry() utility')

// TODO
// * npm-session
// * npm-in-ci
// * npm-scope
// * referer (opts.refer)
// * user-agent
test('miscellaneous headers')
