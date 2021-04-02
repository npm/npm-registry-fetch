'use strict'

const npa = require('npm-package-arg')
const npmlog = require('npmlog')
const t = require('tap')
const tnock = require('./util/tnock.js')
const { HttpErrorAuthOTP } = require('./errors.js')

const fetch = require('../index.js')

npmlog.level = process.env.LOGLEVEL || 'silent'
const OPTS = {
  log: npmlog,
  timeout: 0,
  retry: {
    retries: 1,
    factor: 1,
    minTimeout: 1,
    maxTimeout: 10,
  },
  registry: 'https://mock.reg/',
}

t.test('generic request errors', t => {
  tnock(t, OPTS.registry)
    .get('/ohno/oops')
    .reply(400, 'failwhale!')
  // verify that the otpPrompt won't save from non-OTP errors
  const otpPrompt = () => {
    throw new Error('nope')
  }
  return fetch('/ohno/oops', { ...OPTS, otpPrompt })
    .then(
      () => {
        throw new Error('should not have succeeded!')
      },
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

t.test('pkgid tie fighter', t => {
  tnock(t, OPTS.registry)
    .get('/-/ohno/_rewrite/ohyeah/maybe')
    .reply(400, 'failwhale!')
  return fetch('/-/ohno/_rewrite/ohyeah/maybe', OPTS)
    .then(
      () => {
        throw new Error('should not have succeeded!')
      },
      err => t.equal(err.pkgid, undefined, 'no pkgid on tie fighters')
    )
})

t.test('pkgid _rewrite', t => {
  tnock(t, OPTS.registry)
    .get('/ohno/_rewrite/ohyeah/maybe')
    .reply(400, 'failwhale!')
  return fetch('/ohno/_rewrite/ohyeah/maybe', OPTS)
    .then(
      () => {
        throw new Error('should not have succeeded!')
      },
      err => t.equal(err.pkgid, 'ohyeah', '_rewrite filtered for pkgid')
    )
})

t.test('pkgid with `opts.spec`', t => {
  tnock(t, OPTS.registry)
    .get('/ohno/_rewrite/ohyeah')
    .reply(400, 'failwhale!')
  return fetch('/ohno/_rewrite/ohyeah', {
    ...OPTS,
    spec: npa('foo@1.2.3'),
  })
    .then(
      () => {
        throw new Error('should not have succeeded!')
      },
      err => t.equal(err.pkgid, 'foo@1.2.3', 'opts.spec used for pkgid')
    )
})

t.test('JSON error reporing', t => {
  tnock(t, OPTS.registry)
    .get('/ohno')
    .reply(400, { error: 'badarg' })
  return fetch('/ohno', OPTS)
    .then(
      () => {
        throw new Error('should not have succeeded!')
      },
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
          error: 'badarg',
        }, 'parsed JSON error response available')
      }
    )
})

t.test('OTP error', t => {
  tnock(t, OPTS.registry)
    .get('/otplease')
    .reply(401, { error: 'needs an otp, please' }, {
      'www-authenticate': 'otp',
    })
  return fetch('/otplease', OPTS)
    .then(
      () => {
        throw new Error('Should not have succeeded!')
      },
      err => {
        t.equal(err.code, 'EOTP', 'got special OTP error code')
      }
    )
})

t.test('OTP error with prompt', t => {
  let OTP = null
  tnock(t, OPTS.registry)
    .get('/otplease').times(2)
    .matchHeader('npm-otp', otp => {
      if (otp) {
        OTP = otp[0]
        t.strictSame(otp, ['12345'], 'got expected otp')
      }
      return true
    })
    .reply((...args) => {
      if (OTP === '12345')
        return [200, { ok: 'this is fine' }, {}]
      else
        return [401, { error: 'otp, please' }, { 'www-authenticate': 'otp' }]
    })

  const otpPrompt = async () => '12345'
  return fetch('/otplease', { ...OPTS, otpPrompt })
    .then(res => {
      t.strictSame(res.status, 200, 'got 200 response')
      return res.json()
    }).then(body => {
      t.strictSame(body, { ok: 'this is fine' }, 'got expected body')
    })
})

t.test('OTP error with prompt, expired OTP in settings', t => {
  let OTP = null
  tnock(t, OPTS.registry)
    .get('/otplease').times(2)
    .matchHeader('npm-otp', otp => {
      if (otp) {
        if (!OTP)
          t.strictSame(otp, ['98765'], 'got invalid otp first')
        else
          t.strictSame(otp, ['12345'], 'got expected otp')
        OTP = otp[0]
      }
      return true
    })
    .reply((...args) => {
      if (OTP === '12345')
        return [200, { ok: 'this is fine' }, {}]
      else
        return [401, { error: 'otp, please' }, { 'www-authenticate': 'otp' }]
    })

  const otpPrompt = async () => '12345'
  return fetch('/otplease', { ...OPTS, otpPrompt, otp: '98765' })
    .then(res => {
      t.strictSame(res.status, 200, 'got 200 response')
      return res.json()
    }).then(body => {
      t.strictSame(body, { ok: 'this is fine' }, 'got expected body')
    })
})

t.test('OTP error with prompt that fails', t => {
  tnock(t, OPTS.registry)
    .get('/otplease')
    .reply((...args) => {
      return [401, { error: 'otp, please' }, { 'www-authenticate': 'otp' }]
    })

  const otpPrompt = async () => {
    throw new Error('whoopsie')
  }
  return t.rejects(fetch('/otplease', { ...OPTS, otpPrompt }), HttpErrorAuthOTP)
})

t.test('OTP error with prompt that returns nothing', t => {
  tnock(t, OPTS.registry)
    .get('/otplease')
    .reply((...args) => {
      return [401, { error: 'otp, please' }, { 'www-authenticate': 'otp' }]
    })

  const otpPrompt = async () => {}
  return t.rejects(fetch('/otplease', { ...OPTS, otpPrompt }), HttpErrorAuthOTP)
})

t.test('OTP error when missing www-authenticate', t => {
  tnock(t, OPTS.registry)
    .get('/otplease')
    .reply(401, { error: 'needs a one-time password' })
  return fetch('/otplease', OPTS)
    .then(
      () => {
        throw new Error('Should not have succeeded!')
      },
      err => {
        t.equal(err.code, 'EOTP', 'got special OTP error code even with missing www-authenticate header')
      }
    )
})

t.test('Bad IP address error', t => {
  tnock(t, OPTS.registry)
    .get('/badaddr')
    .reply(401, { error: 'you are using the wrong IP address, friend' }, {
      'www-authenticate': 'ipaddress',
    })
  return fetch('/badaddr', OPTS)
    .then(
      () => {
        throw new Error('Should not have succeeded!')
      },
      err => {
        t.equal(err.code, 'EAUTHIP', 'got special OTP error code')
      }
    )
})

t.test('Unexpected www-authenticate error', t => {
  tnock(t, OPTS.registry)
    .get('/unown')
    .reply(401, {
      error: `
      Pat-a-cake, pat-a-cake, baker's man.
      Bake me a cake as fast as you can
      Pat it, and prick it, and mark it with a "B"
      And put it in the oven for baby and me!
    `,
    }, {
      'www-authenticate': 'pattie-cake-protocol',
    })
  return fetch('/unown', OPTS)
    .then(
      () => {
        throw new Error('Should not have succeeded!')
      },
      err => {
        t.match(err.body.error, /Pat-a-cake/ig, 'error body explains it')
        t.equal(err.code, 'E401', 'Unknown auth errors are generic 401s')
      }
    )
})

t.test('retries certain types')
