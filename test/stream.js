const t = require('tap')

const tnock = require('./util/tnock.js')
const defaultOpts = require('../lib/default-opts.js')
defaultOpts.registry = 'https://mock.reg/'

const fetch = require('..')

const OPTS = {
  timeout: 0,
  retry: {
    retries: 1,
    factor: 1,
    minTimeout: 1,
    maxTimeout: 10,
  },
}

t.test('json.stream', (t) => {
  t.test('fetch.json.stream()', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
      b: 2,
      c: 3,
      something: null,
    })
    const data = await fetch.json.stream('/hello', '$*', OPTS).collect()
    t.same(
      data,
      [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ],
      'got a streamed JSON body'
    )
  })

  t.test('fetch.json.stream opts.mapJSON', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
      b: 2,
      c: 3,
    })
    const data = await fetch.json
      .stream('/hello', '*', {
        ...OPTS,
        mapJSON (value, [key]) {
          return [key, value]
        },
      })
      .collect()
    t.same(
      data,
      [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ],
      'data mapped'
    )
  })

  t.test('fetch.json.stream opts.mapJSON that returns null', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
      b: 2,
      c: 3,
    })
    const data = await fetch.json
      .stream('/hello', '*', {
        ...OPTS,
        // eslint-disable-next-line no-unused-vars
        mapJSON (_value, [_key]) {
          return null
        },
      })
      .collect()
    t.same(data, [])
  })

  t.test('fetch.json.stream gets fetch error on stream', async (t) => {
    await t.rejects(
      fetch.json
        .stream('/hello', '*', {
          ...OPTS,
          body: Promise.reject(new Error('no body for you')),
          method: 'POST',
          gzip: true, // make sure we don't gzip the promise, lol!
        })
        .collect(),
      {
        message: 'no body for you',
      }
    )
  })

  t.test('fetch.json.stream() sets header and footer', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
      b: 2,
      c: 3,
    })
    const data = await fetch.json
      .stream('/hello', 'something-random', OPTS)
      .collect()
    t.same(data, [], 'no data')
  })

  t.test('fetch.json.stream() with recursive JSON', async (t) => {
    tnock(t, defaultOpts.registry)
      .get('/hello')
      .reply(200, {
        dogs: [
          {
            name: 'george',
            owner: {
              name: 'bob',
            },
          },
          {
            name: 'fred',
            owner: {
              name: 'alice',
            },
          },
          {
            name: 'jill',
            owner: {
              name: 'fred',
            },
          },
        ],
      })

    const data = await fetch.json
      .stream('/hello', 'dogs..name', OPTS)
      .collect()
    t.same(data, ['george', 'bob', 'fred', 'alice', 'jill', 'fred'])
  })

  t.test('fetch.json.stream() with undefined path', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
    })
    const data = await fetch.json.stream('/hello', undefined, OPTS).collect()
    t.same(data, [{ a: 1 }])
  })

  t.test('fetch.json.stream() with empty path', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
    })
    const data = await fetch.json.stream('/hello', '', OPTS).collect()
    t.same(data, [])
  })

  t.test('fetch.json.stream() with path with function', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: {
        b: {
          c: 1,
        },
        d: 2,
      },
    })
    const data = await fetch.json
      .stream('/hello', [
        (a) => a,
        {
          test: (a) => a,
        },
      ])
      .collect()
    t.same(data, [{ c: 1 }, 2])
  })

  t.test('fetch.json.stream() with path array with number in path', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: 1,
    })
    const data = await fetch.json.stream('/hello', [1], OPTS).collect()
    t.same(data, [])
  })

  t.test(
    'fetch.json.stream() with path array with recursive and undefined value',
    async (t) => {
      tnock(t, defaultOpts.registry).get('/hello').reply(200, {
        a: {
          b: {
            c: 1,
          },
          d: 2,
        },
      })
      const data = await fetch.json
        .stream('/hello', ['a', '', undefined], OPTS)
        .collect()
      t.same(data, [])
    }
  )

  t.test('fetch.json.stream() emitKey in path', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: {
        b: 1,
      },
    })
    const data = await fetch.json.stream('/hello', ['a', { emitKey: true }], OPTS).collect()
    t.same(data, [{ key: 'b', value: 1 }])
  })

  t.test('fetch.json.stream with recursive path followed by valid key', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, {
      a: {
        b: 1,
      },
    })
    const data = await fetch.json.stream('/hello', ['', 'a'], OPTS).collect()
    t.same(data, [{ b: 1 }])
  })

  t.test('fetch.json.stream encounters malformed json', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, '{')
    const data = await fetch.json.stream('/hello', '*', OPTS).collect()

    t.same(data, [])
  })

  t.test('fetch.json.stream encounters not json string data', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, 'not json')

    // catch rejected promise
    t.rejects(fetch.json.stream('/hello', '*', OPTS).collect(), {
      message: 'Unexpected "o" at position 1 in state STOP',
    })
  })

  t.test('fetch.json.stream encounters not json numerical data', async (t) => {
    tnock(t, defaultOpts.registry).get('/hello').reply(200, 555)

    const data = await fetch.json.stream('/hello', '*', OPTS).collect()
    t.same(data, [])
  })

  t.end()
})
