'use strict'

const { promisify } = require('util')
const statAsync = promisify(require('fs').stat)
const config = require('../config.js')
const npmlog = require('npmlog')
const path = require('path')
const test = require('tap').test
const tnock = require('./util/tnock.js')

const fetch = require('../index.js')

const testDir = require('./util/test-dir.js')(__filename)

npmlog.level = process.env.LOGLEVEL || 'silent'
const REGISTRY = 'https://mock.reg'
const OPTS = config({
  log: npmlog,
  memoize: false,
  timeout: 0,
  retry: {
    retries: 1,
    factor: 1,
    minTimeout: 1,
    maxTimeout: 10
  },
  cache: path.join(testDir, '_cacache'),
  registry: REGISTRY
})

test('can cache GET requests', t => {
  tnock(t, REGISTRY)
    .get('/normal')
    .times(1)
    .reply(200, { obj: 'value' })
  return fetch.json('/normal', OPTS)
    .then(val => t.deepEqual(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/normal', OPTS))
    .then(val => t.deepEqual(val, { obj: 'value' }, 'response was cached'))
})

test('prefer-offline', t => {
  tnock(t, REGISTRY)
    .get('/prefer-offline')
    .times(1)
    .reply(200, { obj: 'value' })
  return fetch.json('/prefer-offline', OPTS.concat({ 'prefer-offline': true }))
    .then(val => t.deepEqual(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/prefer-offline', OPTS.concat({ 'prefer-offline': true })))
    .then(val => t.deepEqual(val, { obj: 'value' }, 'response was cached'))
})

test('offline', t => {
  tnock(t, REGISTRY)
    .get('/offline')
    .times(1)
    .reply(200, { obj: 'value' })
  return fetch.json('/offline', OPTS)
    .then(val => t.deepEqual(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/offline', OPTS.concat({ offline: true })))
    .then(val => t.deepEqual(val, { obj: 'value' }, 'response was cached'))
})

test('offline fails if not cached', t =>
  t.rejects(() => fetch('/offline-fails', OPTS.concat({ offline: true }))))

test('prefer-online', t => {
  tnock(t, REGISTRY)
    .get('/prefer-online')
    .times(2)
    .reply(200, { obj: 'value' })
  return fetch.json('/prefer-online', OPTS)
    .then(val => t.deepEqual(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/prefer-online', OPTS.concat({ 'prefer-online': true })))
    .then(val => t.deepEqual(val, { obj: 'value' }, 'response was refetched'))
})
