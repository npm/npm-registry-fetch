'use strict'

const { promisify } = require('util')
const statAsync = promisify(require('fs').stat)
const npmlog = require('npmlog')
const path = require('path')
const t = require('tap')
const tnock = require('./util/tnock.js')

const fetch = require('..')

const testDir = t.testdir({})

npmlog.level = process.env.LOGLEVEL || 'silent'
const REGISTRY = 'https://mock.reg'
const OPTS = {
  log: npmlog,
  memoize: false,
  timeout: 0,
  retry: {
    retries: 1,
    factor: 1,
    minTimeout: 1,
    maxTimeout: 10,
  },
  cache: path.join(testDir, '_cacache'),
  registry: REGISTRY,
}

t.test('can cache GET requests', t => {
  tnock(t, REGISTRY)
    .get('/normal')
    .times(1)
    .reply(200, { obj: 'value' })
  return fetch.json('/normal', OPTS)
    .then(val => t.same(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.cache))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/normal', OPTS))
    .then(val => t.same(val, { obj: 'value' }, 'response was cached'))
})

t.test('preferOffline', t => {
  tnock(t, REGISTRY)
    .get('/preferOffline')
    .times(1)
    .reply(200, { obj: 'value' })
  return fetch.json('/preferOffline', { ...OPTS, preferOffline: true })
    .then(val => t.same(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.cache))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/preferOffline', { ...OPTS, preferOffline: true }))
    .then(val => t.same(val, { obj: 'value' }, 'response was cached'))
})

t.test('offline', t => {
  tnock(t, REGISTRY)
    .get('/offline')
    .times(1)
    .reply(200, { obj: 'value' })
  return fetch.json('/offline', OPTS)
    .then(val => t.same(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.cache))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/offline', { ...OPTS, offline: true }))
    .then(val => t.same(val, { obj: 'value' }, 'response was cached'))
})

t.test('offline fails if not cached', t =>
  t.rejects(() => fetch('/offline-fails', { ...OPTS, offline: true })))

t.test('preferOnline', t => {
  tnock(t, REGISTRY)
    .get('/preferOnline')
    .times(2)
    .reply(200, { obj: 'value' })
  return fetch.json('/preferOnline', OPTS)
    .then(val => t.same(val, { obj: 'value' }, 'got expected response'))
    .then(() => statAsync(OPTS.cache))
    .then(stat => t.ok(stat.isDirectory(), 'cache directory created'))
    .then(() => fetch.json('/preferOnline', { ...OPTS, preferOnline: true }))
    .then(val => t.same(val, { obj: 'value' }, 'response was refetched'))
})
