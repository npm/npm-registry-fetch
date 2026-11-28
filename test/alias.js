const t = require('tap')
const npa = require('npm-package-arg')
const fetch = require('..')
const tnock = require('./util/tnock.js')

const registry = 'https://default.mock.reg/'
const targetRegistry = 'https://target.mock.reg/'
const aliasRegistry = 'https://alias.mock.reg/'
const projectRegistry = 'https://project.mock.reg/'
const opts = {
  registry,
  '@target:registry': targetRegistry,
  '@alias:registry': aliasRegistry,
  '@project:registry': projectRegistry,
}

const cases = [
  ['pkg@npm:@target/pkg@1.0.0', targetRegistry],
  ['npm:@target/pkg@^1.0.0', targetRegistry],
  ['@alias/pkg@npm:@target/pkg@latest', targetRegistry],
  ['@alias/pkg@npm:pkg@1.0.0', registry],
  ['pkg@npm:pkg@^1.0.0', registry],
  ['@alias/pkg@npm:@unconfigured/pkg@1.0.0', registry],
]

t.test('pickRegistry uses the alias target scope', t => {
  for (const [spec, expected] of cases) {
    t.equal(fetch.pickRegistry(spec, opts), expected, spec)
    t.equal(fetch.pickRegistry(npa(spec), opts), expected, `parsed ${spec}`)
  }
  t.equal(fetch.pickRegistry('@alias/pkg@npm:pkg'),
    'https://registry.npmjs.org/', 'unscoped target uses the default registry')
  t.equal(fetch.pickRegistry('pkg@npm:@target/pkg', { ...opts, scope: '@project' }),
    targetRegistry, 'target scope takes precedence over opts.scope')
  t.equal(fetch.pickRegistry('@alias/pkg@npm:pkg', { ...opts, scope: '@project' }),
    projectRegistry, 'opts.scope still supplies a fallback for an unscoped target')
  t.equal(fetch.pickRegistry('@alias/pkg@npm:@unconfigured/pkg', {
    ...opts,
    scope: 'project',
  }), projectRegistry, 'opts.scope still supplies a fallback for an unconfigured target')
  t.end()
})

t.test('fetch resolves alias requests using the target registry', async t => {
  for (const [spec, expected] of cases) {
    await t.test(spec, async t => {
      for (const host of [registry, targetRegistry, aliasRegistry]) {
        tnock(t, host).get('/pkg').optionally().reply(200, { source: host })
      }
      const result = await fetch.json('/pkg', { ...opts, spec })
      t.equal(result.source, expected, 'request reaches the target package registry')
    })
  }
})

t.test('an absolute request URI is preserved with an alias spec', async t => {
  const absoluteRegistry = 'https://explicit.mock.reg/'
  tnock(t, absoluteRegistry).get('/pkg').reply(200, { source: absoluteRegistry })
  const result = await fetch.json(`${absoluteRegistry}pkg`, {
    ...opts,
    spec: 'pkg@npm:@target/pkg',
  })
  t.equal(result.source, absoluteRegistry)
})
