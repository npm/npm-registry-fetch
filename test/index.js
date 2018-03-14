'use strict'

const npmlog = require('npmlog')
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
      t.equal(res.status, 200)
      return res.json()
    })
    .then(json => t.deepEqual(json, {hello: 'world'}))
})

test('json()')
test('method configurable')
test('npm-notice header logging')
test('optionally verifies request body integrity')
test('pickRegistry() utility')

// TODO
// * npm-session
// * npm-in-ci
// * npm-scope
// * referer (opts.refer)
// * user-agent
test('miscellaneous headers')
