const t = require('tap')
const { JSONStreamError, parse } = require('../lib/json-stream.js')

t.test('JSONStream', (t) => {
  t.test('JSONStreamError constructor', (t) => {
    const error = new JSONStreamError(new Error('error'))
    t.equal(error.message, 'error')
    t.equal(error.name, 'JSONStreamError')
    t.end()
  })

  t.test('JSONStream.write', (t) => {
    t.test('JSONStream write error from numerical (not string not buffer)', async (t) => {
      const stream = parse('*', {})
      try {
        stream.write(5)
      } catch (error) {
        t.equal(error.message, 'Can only parse JSON from string or buffer input')
        t.equal(error.name, 'TypeError')
      }
      t.end()
    })

    t.end()
  })

  t.test('JSONStream.end', (t) => {
    t.test(
      'JSONStream end invalid chunk throws JSONStreamError from parser',
      (t) => {
        const stream = parse('*', {})
        try {
          stream.end('not a valid chunk')
        } catch (error) {
          t.equal(error.name, 'JSONStreamError')
          t.equal(error.message, 'Unexpected "o" at position 1 in state STOP')
        }
        t.end()
      }
    )

    t.end()
  })

  t.end()
})
