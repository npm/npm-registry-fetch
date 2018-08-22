'use strict'

const Buffer = require('safe-buffer').Buffer

const npmlog = require('npmlog')
const test = require('tap').test
const tnock = require('./util/tnock.js')

const fetch = require('../index.js')
const getAuth = require('../auth.js')

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

test('basic auth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    username: 'globaluser',
    password: Buffer.from('globalpass', 'utf8').toString('base64'),
    email: 'global@ma.il',
    '//my.custom.registry/here/:username': 'user',
    '//my.custom.registry/here/:password': Buffer.from('pass', 'utf8').toString('base64'),
    '//my.custom.registry/here/:email': 'e@ma.il'
  }
  t.deepEqual(getAuth(config.registry, config), {
    alwaysAuth: false,
    username: 'user',
    password: 'pass',
    email: 'e@ma.il'
  }, 'basic auth details generated')

  const opts = Object.assign({}, OPTS, config)
  const encoded = Buffer.from(`user:pass`, 'utf8').toString('base64')
  tnock(t, opts.registry)
    .matchHeader('authorization', auth => {
      t.equal(auth[0], `Basic ${encoded}`, 'got encoded basic auth')
      return auth[0] === `Basic ${encoded}`
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'basic auth succeeded'))
})

test('token auth', t => {
  const config = {
    'registry': 'https://my.custom.registry/here/',
    'token': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }
  t.deepEqual(getAuth(config.registry, config), {
    alwaysAuth: false,
    token: 'c0ffee'
  }, 'correct auth token picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', auth => {
      t.equal(auth[0], 'Bearer c0ffee', 'got correct bearer token')
      return auth[0] === 'Bearer c0ffee'
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
})

test('forceAuth', t => {
  const config = {
    'registry': 'https://my.custom.registry/here/',
    'token': 'deadbeef',
    'always-auth': false,
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
    'forceAuth': {
      'username': 'user',
      'password': Buffer.from('pass', 'utf8').toString('base64'),
      'email': 'e@ma.il',
      'always-auth': true
    }
  }
  t.deepEqual(getAuth(config.registry, config), {
    alwaysAuth: true,
    username: 'user',
    password: 'pass',
    email: 'e@ma.il'
  }, 'only forceAuth details included')

  const opts = Object.assign({}, OPTS, config)
  const encoded = Buffer.from(`user:pass`, 'utf8').toString('base64')
  tnock(t, opts.registry)
    .matchHeader('authorization', auth => {
      t.equal(auth[0], `Basic ${encoded}`, 'got encoded basic auth')
      return auth[0] === `Basic ${encoded}`
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'used forced auth details'))
})

test('_auth auth', t => {
  const config = {
    'registry': 'https://my.custom.registry/here/',
    '_auth': 'deadbeef',
    '//my.custom.registry/here/:_auth': 'c0ffee'
  }
  t.deepEqual(getAuth(config.registry, config), {
    alwaysAuth: false,
    _auth: 'c0ffee'
  }, 'correct _auth picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', `Basic c0ffee`)
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', '_auth auth succeeded'))
})

test('globally-configured auth', t => {
  const basicConfig = {
    'registry': 'https://different.registry/',
    'username': 'globaluser',
    'password': Buffer.from('globalpass', 'utf8').toString('base64'),
    'email': 'global@ma.il',
    '//my.custom.registry/here/:username': 'user',
    '//my.custom.registry/here/:password': Buffer.from('pass', 'utf8').toString('base64'),
    '//my.custom.registry/here/:email': 'e@ma.il'
  }
  t.deepEqual(getAuth(basicConfig.registry, basicConfig), {
    alwaysAuth: false,
    username: 'globaluser',
    password: 'globalpass',
    email: 'global@ma.il'
  }, 'basic auth details generated from global settings')

  const tokenConfig = {
    'registry': 'https://different.registry/',
    '_authToken': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }
  t.deepEqual(getAuth(tokenConfig.registry, tokenConfig), {
    alwaysAuth: false,
    token: 'deadbeef'
  }, 'correct global auth token picked out')

  const _authConfig = {
    'registry': 'https://different.registry/',
    '_auth': 'deadbeef',
    '//my.custom.registry/here/:_auth': 'c0ffee'
  }
  t.deepEqual(getAuth(_authConfig.registry, _authConfig), {
    alwaysAuth: false,
    _auth: 'deadbeef'
  }, 'correct global _auth picked out')

  t.done()
})

test('otp token passed through', t => {
  const config = {
    'registry': 'https://my.custom.registry/here/',
    'token': 'deadbeef',
    'otp': '694201',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }
  t.deepEqual(getAuth(config.registry, config), {
    alwaysAuth: false,
    token: 'c0ffee',
    otp: '694201'
  }, 'correct auth token picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', `Bearer c0ffee`)
    .matchHeader('npm-otp', otp => {
      t.equal(otp[0], config.otp, 'got the right otp token')
      return otp[0] === config.otp
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'otp auth succeeded'))
})

test('different hosts for uri vs registry', t => {
  const config = {
    'always-auth': false,
    'registry': 'https://my.custom.registry/here/',
    'token': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }

  const opts = Object.assign({}, OPTS, config)
  tnock(t, 'https://some.other.host/')
    .matchHeader('authorization', auth => {
      t.notOk(auth, 'no authorization header was sent')
      return !auth
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('https://some.other.host/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
})

test('http vs https auth sending', t => {
  const config = {
    'always-auth': false,
    'registry': 'https://my.custom.registry/here/',
    'token': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }

  const opts = Object.assign({}, OPTS, config)
  tnock(t, 'http://my.custom.registry/here/')
    .matchHeader('authorization', `Bearer c0ffee`)
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('http://my.custom.registry/here/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
})

test('always-auth', t => {
  const config = {
    'registry': 'https://my.custom.registry/here/',
    'always-auth': 'true',
    'token': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }
  t.deepEqual(getAuth(config.registry, config), {
    alwaysAuth: true,
    token: 'c0ffee'
  }, 'correct auth token picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, 'https://some.other.host/')
    .matchHeader('authorization', `Bearer c0ffee`)
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('https://some.other.host/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
})

test('scope-based auth', t => {
  const config = {
    'registry': 'https://my.custom.registry/here/',
    'scope': '@myscope',
    '@myscope:registry': 'https://my.custom.registry/here/',
    'token': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope'
  }
  t.deepEqual(getAuth(config['@myscope:registry'], config), {
    alwaysAuth: false,
    token: 'c0ffee'
  }, 'correct auth token picked out')
  t.deepEqual(getAuth(config['@myscope:registry'], config), {
    alwaysAuth: false,
    token: 'c0ffee'
  }, 'correct auth token picked out without scope config having an @')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts['@myscope:registry'])
    .matchHeader('authorization', auth => {
      t.equal(auth[0], 'Bearer c0ffee', 'got correct bearer token for scope')
      return auth[0] === 'Bearer c0ffee'
    })
    .get('/hello')
    .times(2)
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
    .then(() => fetch.json('/hello', Object.assign({}, opts, {
      scope: 'myscope'
    })))
    .then(res => t.equal(res, 'success', 'token auth succeeded without @ in scope'))
})
