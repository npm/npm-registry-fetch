'use strict'

const t = require('tap')
const tnock = require('./util/tnock.js')

const fetch = require('..')
const getAuth = require('../lib/auth.js')

const OPTS = {
  timeout: 0,
  retry: {
    retries: 1,
    factor: 1,
    minTimeout: 1,
    maxTimeout: 10,
  },
  registry: 'https://mock.reg/',
}

t.test('basic auth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    username: 'globaluser',
    password: Buffer.from('globalpass', 'utf8').toString('base64'),
    email: 'global@ma.il',
    '//my.custom.registry/here/:username': 'user',
    '//my.custom.registry/here/:_password': Buffer.from('pass', 'utf8').toString('base64'),
    '//my.custom.registry/here/:email': 'e@ma.il',
  }
  const gotAuth = getAuth(config.registry, config)
  t.same(gotAuth, {
    scopeAuthKey: null,
    token: null,
    isBasicAuth: true,
    auth: Buffer.from('user:pass').toString('base64'),
  }, 'basic auth details generated')

  const opts = Object.assign({}, OPTS, config)
  const encoded = Buffer.from('user:pass', 'utf8').toString('base64')
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

t.test('token auth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    token: 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
    '//my.custom.registry/:_authToken': 'c0ffee',
    '//my.custom.registry/:token': 'nope',
  }
  t.same(getAuth(`${config.registry}/foo/-/foo.tgz`, config), {
    scopeAuthKey: null,
    isBasicAuth: false,
    token: 'c0ffee',
    auth: null,
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

t.test('forceAuth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    token: 'deadbeef',
    'always-auth': false,
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
    forceAuth: {
      username: 'user',
      password: Buffer.from('pass', 'utf8').toString('base64'),
      email: 'e@ma.il',
      'always-auth': true,
    },
  }
  t.same(getAuth(config.registry, config), {
    scopeAuthKey: null,
    token: null,
    isBasicAuth: true,
    auth: Buffer.from('user:pass').toString('base64'),
  }, 'only forceAuth details included')

  const opts = Object.assign({}, OPTS, config)
  const encoded = Buffer.from('user:pass', 'utf8').toString('base64')
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

t.test('forceAuth token', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    token: 'deadbeef',
    'always-auth': false,
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
    forceAuth: {
      token: 'cafebad',
    },
  }
  t.same(getAuth(config.registry, config), {
    scopeAuthKey: null,
    isBasicAuth: false,
    token: 'cafebad',
    auth: null,
  }, 'correct forceAuth token picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', auth => {
      t.equal(auth[0], 'Bearer cafebad', 'got correct bearer token')
      return auth[0] === 'Bearer cafebad'
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'token forceAuth succeeded'))
})

t.test('_auth auth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    _auth: 'deadbeef',
    '//my.custom.registry/:_auth': 'decafbad',
    '//my.custom.registry/here/:_auth': 'c0ffee',
  }
  t.same(getAuth(`${config.registry}/asdf/foo/bar/baz`, config), {
    scopeAuthKey: null,
    token: null,
    isBasicAuth: false,
    auth: 'c0ffee',
  }, 'correct _auth picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', 'Basic c0ffee')
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', '_auth auth succeeded'))
})

t.test('_auth username:pass auth', t => {
  const username = 'foo'
  const password = 'bar'
  const auth = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
  const config = {
    registry: 'https://my.custom.registry/here/',
    _auth: 'foobarbaz',
    '//my.custom.registry/here/:_auth': auth,
  }
  t.same(getAuth(config.registry, config), {
    scopeAuthKey: null,
    token: null,
    isBasicAuth: false,
    auth: auth,
  }, 'correct _auth picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', `Basic ${auth}`)
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', '_auth auth succeeded'))
})

t.test('ignore user/pass when _auth is set', t => {
  const username = 'foo'
  const password = Buffer.from('bar', 'utf8').toString('base64')
  const auth = Buffer.from('not:foobar', 'utf8').toString('base64')
  const config = {
    '//registry/:_auth': auth,
    '//registry/:username': username,
    '//registry/:password': password,
    'always-auth': 'false',
  }

  const expect = {
    scopeAuthKey: null,
    auth,
    isBasicAuth: false,
    token: null,
  }

  t.match(getAuth('http://registry/pkg/-/pkg-1.2.3.tgz', config), expect)

  t.end()
})

t.test('globally-configured auth', t => {
  const basicConfig = {
    registry: 'https://different.registry/',
    '//different.registry/:username': 'globaluser',
    '//different.registry/:_password': Buffer.from('globalpass', 'utf8').toString('base64'),
    '//different.registry/:email': 'global@ma.il',
    '//my.custom.registry/here/:username': 'user',
    '//my.custom.registry/here/:_password': Buffer.from('pass', 'utf8').toString('base64'),
    '//my.custom.registry/here/:email': 'e@ma.il',
  }
  t.same(getAuth(basicConfig.registry, basicConfig), {
    scopeAuthKey: null,
    token: null,
    isBasicAuth: true,
    auth: Buffer.from('globaluser:globalpass').toString('base64'),
  }, 'basic auth details generated from global settings')

  const tokenConfig = {
    registry: 'https://different.registry/',
    '//different.registry/:_authToken': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
  }
  t.same(getAuth(tokenConfig.registry, tokenConfig), {
    scopeAuthKey: null,
    token: 'deadbeef',
    isBasicAuth: false,
    auth: null,
  }, 'correct global auth token picked out')

  const _authConfig = {
    registry: 'https://different.registry/',
    '//different.registry:_auth': 'deadbeef',
    '//different.registry/bar:_auth': 'incorrect',
    '//my.custom.registry/here/:_auth': 'c0ffee',
  }
  t.same(getAuth(`${_authConfig.registry}/foo`, _authConfig), {
    scopeAuthKey: null,
    token: null,
    isBasicAuth: false,
    auth: 'deadbeef',
  }, 'correct _auth picked out')

  t.end()
})

t.test('otp token passed through', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    token: 'deadbeef',
    otp: '694201',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
  }
  t.same(getAuth(config.registry, config), {
    scopeAuthKey: null,
    token: 'c0ffee',
    isBasicAuth: false,
    auth: null,
  }, 'correct auth token picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, opts.registry)
    .matchHeader('authorization', 'Bearer c0ffee')
    .matchHeader('npm-otp', otp => {
      t.equal(otp[0], config.otp, 'got the right otp token')
      return otp[0] === config.otp
    })
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('/hello', opts)
    .then(res => t.equal(res, 'success', 'otp auth succeeded'))
})

t.test('different hosts for uri vs registry', t => {
  const config = {
    'always-auth': false,
    registry: 'https://my.custom.registry/here/',
    token: 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
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

t.test('http vs https auth sending', t => {
  const config = {
    'always-auth': false,
    registry: 'https://my.custom.registry/here/',
    token: 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
  }

  const opts = Object.assign({}, OPTS, config)
  tnock(t, 'http://my.custom.registry/here/')
    .matchHeader('authorization', 'Bearer c0ffee')
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('http://my.custom.registry/here/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
})

t.test('always-auth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    'always-auth': 'true',
    '//some.other.host/:_authToken': 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
  }
  t.same(getAuth(config.registry, config), {
    scopeAuthKey: null,
    token: 'c0ffee',
    isBasicAuth: false,
    auth: null,
  }, 'correct auth token picked out')

  const opts = Object.assign({}, OPTS, config)
  tnock(t, 'https://some.other.host/')
    .matchHeader('authorization', 'Bearer deadbeef')
    .get('/hello')
    .reply(200, '"success"')
  return fetch.json('https://some.other.host/hello', opts)
    .then(res => t.equal(res, 'success', 'token auth succeeded'))
})

t.test('scope-based auth', t => {
  const config = {
    registry: 'https://my.custom.registry/here/',
    scope: '@myscope',
    '@myscope:registry': 'https://my.custom.registry/here/',
    token: 'deadbeef',
    '//my.custom.registry/here/:_authToken': 'c0ffee',
    '//my.custom.registry/here/:token': 'nope',
  }
  t.same(getAuth(config['@myscope:registry'], config), {
    scopeAuthKey: null,
    auth: null,
    isBasicAuth: false,
    token: 'c0ffee',
  }, 'correct auth token picked out')
  t.same(getAuth(config['@myscope:registry'], config), {
    scopeAuthKey: null,
    auth: null,
    isBasicAuth: false,
    token: 'c0ffee',
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
      scope: 'myscope',
    })))
    .then(res => t.equal(res, 'success', 'token auth succeeded without @ in scope'))
})

t.test('auth needs a uri', t => {
  t.throws(() => getAuth(null), { message: 'URI is required' })
  t.end()
})

t.test('do not be thrown by other weird configs', t => {
  const opts = {
    scope: '@asdf',
    '@asdf:_authToken': 'does this work?',
    '//registry.npmjs.org:_authToken': 'do not share this',
    _authToken: 'definitely do not share this, either',
    '//localhost:15443:_authToken': 'wrong',
    '//localhost:15443/foo:_authToken': 'correct bearer token',
    '//localhost:_authToken': 'not this one',
    '//other-registry:_authToken': 'this should not be used',
    '@asdf:registry': 'https://other-registry/',
    spec: '@asdf/foo',
  }
  const uri = 'http://localhost:15443/foo/@asdf/bar/-/bar-1.2.3.tgz'
  const auth = getAuth(uri, opts)
  t.same(auth, {
    scopeAuthKey: null,
    token: 'correct bearer token',
    isBasicAuth: false,
    auth: null,
  })
  t.end()
})

t.test('scopeAuthKey tests', t => {
  const opts = {
    '@other-scope:registry': 'https://other-scope-registry.com/',
    '//other-scope-registry.com/:_authToken': 'cafebad',
    '@scope:registry': 'https://scope-host.com/',
    '//scope-host.com/:_authToken': 'c0ffee',
  }
  const uri = 'https://tarball-host.com/foo/foo.tgz'

  t.same(getAuth(uri, { ...opts, spec: '@scope/foo@latest' }), {
    scopeAuthKey: '//scope-host.com/',
    auth: null,
    isBasicAuth: false,
    token: null,
  }, 'regular scoped spec')

  t.same(getAuth(uri, { ...opts, spec: 'foo@npm:@scope/foo@latest' }), {
    scopeAuthKey: '//scope-host.com/',
    auth: null,
    isBasicAuth: false,
    token: null,
  }, 'scoped pkg aliased to unscoped name')

  t.same(getAuth(uri, { ...opts, spec: '@other-scope/foo@npm:@scope/foo@latest' }), {
    scopeAuthKey: '//scope-host.com/',
    auth: null,
    isBasicAuth: false,
    token: null,
  }, 'scoped name aliased to other scope with auth')

  t.same(getAuth(uri, { ...opts, spec: '@scope/foo@npm:foo@latest' }), {
    scopeAuthKey: null,
    auth: null,
    isBasicAuth: false,
    token: null,
  }, 'unscoped aliased to scoped name')

  t.end()
})

t.test('registry host matches, path does not, send auth', t => {
  const opts = {
    '@other-scope:registry': 'https://other-scope-registry.com/other/scope/',
    '//other-scope-registry.com/other/scope/:_authToken': 'cafebad',
    '@scope:registry': 'https://scope-host.com/scope/host/',
    '//scope-host.com/scope/host/:_authToken': 'c0ffee',
    registry: 'https://registry.example.com/some/path/',
  }
  const uri = 'https://scope-host.com/blahblah/bloobloo/foo.tgz'
  t.same(getAuth(uri, { ...opts, spec: '@scope/foo' }), {
    scopeAuthKey: null,
    token: 'c0ffee',
    auth: null,
    isBasicAuth: false,
  })
  t.same(getAuth(uri, { ...opts, spec: '@other-scope/foo' }), {
    scopeAuthKey: '//other-scope-registry.com/other/scope/',
    token: null,
    auth: null,
    isBasicAuth: false,
  })
  t.same(getAuth(uri, { ...opts, registry: 'https://scope-host.com/scope/host/' }), {
    scopeAuthKey: null,
    token: 'c0ffee',
    auth: null,
    isBasicAuth: false,
  })
  t.end()
})
