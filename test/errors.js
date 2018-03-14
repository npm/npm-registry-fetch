'use strict'

const npmlog = require('npmlog')
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

test('generic request errors', t => {
  tnock(t, OPTS.config.get('registry'))
    .get('/ohno')
    .reply(400, 'failwhale!')
  return fetch('/ohno', OPTS)
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => {
        t.equal(
          err.message,
          `400 Bad Request - GET ${OPTS.config.get('registry')}ohno`,
          'neatly printed message'
        )
        t.equal(err.code, 'E400', 'HTTP code used for err.code')
        t.equal(err.statusCode, 400, 'numerical HTTP code available')
        t.equal(err.method, 'GET', 'method in error object')
        t.equal(err.body.toString('utf8'), 'failwhale!', 'req body reported')
      }
    )
})

test('JSON error reporing', t => {
  tnock(t, OPTS.config.get('registry'))
    .get('/ohno')
    .reply(400, {error: 'badarg'})
  return fetch('/ohno', OPTS)
    .then(
      () => { throw new Error('should not have succeeded!') },
      err => {
        t.equal(
          err.message,
          `400 Bad Request - GET ${OPTS.config.get('registry')}ohno - badarg`,
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
  tnock(t, OPTS.config.get('registry'))
    .get('/otplease')
    .reply(401, {error: 'needs an otp, please'}, {
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

test('Bad IP address error', t => {
  tnock(t, OPTS.config.get('registry'))
    .get('/badaddr')
    .reply(401, {error: 'you are using the wrong IP address, friend'}, {
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
  tnock(t, OPTS.config.get('registry'))
    .get('/unown')
    .reply(401, {error: `
      Pat-a-cake, pat-a-cake, baker's man.
      Bake me a cake as fast as you can
      Pat it, and prick it, and mark it with a "B"
      And put it in the oven for baby and me!
    `}, {
      'www-authenticate': 'pattie-cake-protocol'
    })
  return fetch('/unown', OPTS)
    .then(
      () => { throw new Error('Should not have succeeded!') },
      err => {
        t.match(err.body.error, /Pat-a-cake/ig, 'error body explains it')
        t.equal(err.code, 'EAUTHUNOWN', 'got a special pokemon')
      }
    )
})

test('retries certain types')
