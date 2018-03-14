'use strict'

const test = require('tap').test

test('basic auth')
test('token auth')
test('otp token passed through')
test('http vs https auth sending')
test('different hosts for uri vs registry')
test('scope-based auth')
test('always-auth')
test('reg:_authToken')
test('reg:_auth')
// NOTE - this is for `_authToken=...` and such, without `//registry/:` prefix
test('globally-configured auth')
test('config from npm.config-like object')
