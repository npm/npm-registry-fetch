'use strict'

const npa = require('npm-package-arg')
const npmlog = require('npmlog')
const test = require('tap').test
const tnock = require('./util/tnock.js')

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

test('generic request errors', t => {
  tnock(t, OPTS.registry)
    .get('/ohno/oops')
    .reply(400, 'failwhale!')
  return fetch('/ohno/oops', OPTS)
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => {
        t.equal(
          err.message,
          `400 Bad Request - GET ${OPTS.registry}ohno/oops`,
          'neatly printed message'
        )
        t.equal(err.code, 'E400', 'HTTP code used for err.code')
        t.equal(err.statusCode, 400, 'numerical HTTP code available')
        t.equal(err.method, 'GET', 'method in error object')
        t.equal(err.body.toString('utf8'), 'failwhale!', 'req body reported')
        t.equal(err.pkgid, 'oops', 'base path used for pkgid')
      }
    )
})

test('pkgid tie fighter', t => {
  tnock(t, OPTS.registry)
    .get('/-/ohno/_rewrite/ohyeah/maybe')
    .reply(400, 'failwhale!')
  return fetch('/-/ohno/_rewrite/ohyeah/maybe', OPTS)
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => t.equal(err.pkgid, undefined, 'no pkgid on tie fighters')
    )
})

test('pkgid _rewrite', t => {
  tnock(t, OPTS.registry)
    .get('/ohno/_rewrite/ohyeah/maybe')
    .reply(400, 'failwhale!')
  return fetch('/ohno/_rewrite/ohyeah/maybe', OPTS)
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => t.equal(err.pkgid, 'ohyeah', '_rewrite filtered for pkgid')
    )
})

test('pkgid with `opts.spec`', t => {
  tnock(t, OPTS.registry)
    .get('/ohno/_rewrite/ohyeah')
    .reply(400, 'failwhale!')
  return fetch('/ohno/_rewrite/ohyeah', {
    ...OPTS,
    spec: npa('foo@1.2.3')
  })
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => t.equal(err.pkgid, 'foo@1.2.3', 'opts.spec used for pkgid')
    )
})

test('JSON error reporing', t => {
  tnock(t, OPTS.registry)
    .get('/ohno')
    .reply(400, { error: 'badarg' })
  return fetch('/ohno', OPTS)
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => {
        t.equal(
          err.message,
          `400 Bad Request - GET ${OPTS.registry}ohno - badarg`,
          'neatly printed message'
        )
        t.equal(err.code, 'E400', 'HTTP code used for err.code')
        t.equal(err.statusCode, 400, 'numerical HTTP code available')
        t.equal(err.method, 'GET', 'method in error object')
        t.deepEqual(err.body, {
          error: 'badarg'
        }, 'parsed JSON error response available')
      }
    )
})

test('OTP error', t => {
  tnock(t, OPTS.registry)
    .get('/otplease')
    .reply(401, { error: 'needs an otp, please' }, {
      'www-authenticate': 'otp'
    })
  return fetch('/otplease', OPTS)
    .then(
      () => { throw new Error('Should not have succeeded!') },
      err => {
        t.equal(err.code, 'EOTP', 'got special OTP error code')
      }
    )
})

test('OTP error when missing www-authenticate', t => {
  tnock(t, OPTS.registry)
    .get('/otplease')
    .reply(401, { error: 'needs a one-time password' })
  return fetch('/otplease', OPTS)
    .then(
      () => { throw new Error('Should not have succeeded!') },
      err => {
        t.equal(err.code, 'EOTP', 'got special OTP error code even with missing www-authenticate header')
      }
    )
})

test('Bad IP address error', t => {
  tnock(t, OPTS.registry)
    .get('/badaddr')
    .reply(401, { error: 'you are using the wrong IP address, friend' }, {
      'www-authenticate': 'ipaddress'
    })
  return fetch('/badaddr', OPTS)
    .then(
      () => { throw new Error('Should not have succeeded!') },
      err => {
        t.equal(err.code, 'EAUTHIP', 'got special OTP error code')
      }
    )
})

test('Unexpected www-authenticate error', t => {
  tnock(t, OPTS.registry)
    .get('/unown')
    .reply(401, {
      error: `
      Pat-a-cake, pat-a-cake, baker's man.
      Bake me a cake as fast as you can
      Pat it, and prick it, and mark it with a "B"
      And put it in the oven for baby and me!
    `
    }, {
      'www-authenticate': 'pattie-cake-protocol'
    })
  return fetch('/unown', OPTS)
    .then(
      () => { throw new Error('Should not have succeeded!') },
      err => {
        t.match(err.body.error, /Pat-a-cake/ig, 'error body explains it')
        t.equal(err.code, 'E401', 'Unknown auth errors are generic 401s')
      }
    )
})

test('retries certain types')
