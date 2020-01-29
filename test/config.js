'use strict'

const requireInject = require('require-inject')
const config = requireInject('../config.js', {
  '@npmcli/ci-detect': () => false
})
const npmlog = require('npmlog')
const { test } = require('tap')

npmlog.level = process.env.LOGLEVEL || 'silent'

test('isFromCI config option', t => {
  const OPTS = config({
    log: npmlog,
    timeout: 0,
    registry: 'https://mock.reg/'
  })
  t.equal(OPTS.isFromCI, false, 'should be false if not on a CI env')
  t.end()
})

test('default timeout', t => {
  const DEFAULT_OPTS = config({})
  t.equal(DEFAULT_OPTS.timeout, 30 * 1000, 'default timeout is 30s')
  const SPECIFIED_OPTS = config({
    timeout: 15 * 1000
  })
  t.equal(SPECIFIED_OPTS.timeout, 15 * 1000, 'default timeout can be overridden')
  t.end()
})
