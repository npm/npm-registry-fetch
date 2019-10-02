'use strict'

const BB = require('bluebird')

const config = require('../config.js')
const fs = BB.promisifyAll(require('fs'))
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
    .get('/hello')
    .times(1)
    .reply(200, {obj: 'value'})
  return fetch.json('/hello', OPTS)
    .then(val => t.deepEqual(val, {obj: 'value'}, 'got expected response'))
    .then(() => fs.statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/hello', OPTS))
    .then(val => t.deepEqual(val, {obj: 'value'}, 'response was cached'))
})

test('prefer-offline', t => {
  tnock(t, REGISTRY)
    .get('/hello')
    .times(1)
    .reply(200, {obj: 'value'})
  return fetch.json('/hello', OPTS.concat({'prefer-offline': true}))
    .then(val => t.deepEqual(val, {obj: 'value'}, 'got expected response'))
    .then(() => fs.statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/hello', OPTS.concat({'prefer-offline': true})))
    .then(val => t.deepEqual(val, {obj: 'value'}, 'response was cached'))
})

test('offline', t => {
  tnock(t, REGISTRY)
    .get('/hello')
    .times(1)
    .reply(200, {obj: 'value'})
  return fetch.json('/hello', OPTS)
    .then(val => t.deepEqual(val, {obj: 'value'}, 'got expected response'))
    .then(() => fs.statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/hello', OPTS.concat({ offline: true })))
    .then(val => t.deepEqual(val, {obj: 'value'}, 'response was cached'))
})

test('offline fails if not cached', t =>
  t.rejects(fetch.json('/hello', OPTS.concat({offline: true}))))

test('prefer-online', t => {
  tnock(t, REGISTRY)
    .get('/hello')
    .times(2)
    .reply(200, {obj: 'value'})
  return fetch.json('/hello', OPTS)
    .then(val => t.deepEqual(val, {obj: 'value'}, 'got expected response'))
    .then(() => fs.statAsync(OPTS.get('cache')))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/hello', OPTS.concat({ 'prefer-online': true })))
    .then(val => t.deepEqual(val, {obj: 'value'}, 'response was refetched'))
})
