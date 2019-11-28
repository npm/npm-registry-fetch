'use strict'

const config = require('../config.js')
const npmlog = require('npmlog')
const { test } = require('tap')

npmlog.level = process.env.LOGLEVEL || 'silent'

test('isFromCI config option', t => {
  const CI = process.env.CI
  process.env.CI = false
  t.teardown(t => {
    process.env.CI = CI
  })
  const OPTS = config({
    log: npmlog,
    timeout: 0,
    registry: 'https://mock.reg/'
  })
  t.notOk(OPTS.isFromCI, 'should be false if not on a CI env')
  t.end()
})
