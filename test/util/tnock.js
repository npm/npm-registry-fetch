'use strict'

const nock = require('nock')
const clearMemoized = require('cacache').clearMemoized

module.exports = tnock
function tnock (t, host) {
  clearMemoized()
  const server = nock(host)
  t.teardown(function () {
    server.done()
  })
  return server
}
