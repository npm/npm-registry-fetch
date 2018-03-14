'use strict'

const Buffer = require('safe-buffer').Buffer

const getAuth = require('./auth.js')
const checkResponse = require('./check-response.js')
const fetch = require('make-fetch-happen')
const npa = require('npm-package-arg')
const url = require('url')

const noop = Function.prototype
const silentLog = {
  error: noop,
  warn: noop,
  notice: noop,
  info: noop,
  verbose: noop,
  silly: noop,
  http: noop,
  pause: noop,
  resume: noop
}

module.exports = regFetch
function regFetch (uri, opts) {
  opts = Object.assign({
    log: silentLog,
    config: new Map()
  }, opts)
  const registry = opts.registry ||
    opts.config.get('registry') ||
    'https://registry.npmjs.org/'
  uri = url.parse(uri).protocol
    ? uri
    : `${
      registry.trim().replace(/\/?$/g, '')
    }/${
      uri.trim().replace(/^\//, '')
    }`
  // through that takes into account the scope, the prefix of `uri`, etc
  const startTime = Date.now()
  const conf = opts.config
  return fetch(uri, {
    agent: opts.agent,
    algorithms: opts.algorithms,
    cache: getCacheMode(conf),
    cacheManager: conf.get('cache'),
    ca: conf.get('ca'),
    cert: conf.get('cert'),
    headers: getHeaders(registry, uri, opts),
    integrity: opts.integrity,
    key: conf.get('key'),
    localAddress: conf.get('local-address'),
    maxSockets: conf.get('maxsockets'),
    memoize: opts.memoize,
    method: opts.method || 'GET',
    noProxy: conf.get('noproxy'),
    Promise: opts.Promise,
    proxy: conf.get('proxy'),
    referer: opts.refer || conf.get('refer'),
    retry: opts.retry != null
      ? opts.retry
      : {
        retries: conf.get('fetch-retries'),
        factor: conf.get('fetch-retry-factor'),
        minTimeout: conf.get('fetch-retry-mintimeout'),
        maxTimeout: conf.get('fetch-retry-maxtimeout')
      },
    strictSSL: !!conf.get('strict-ssl'),
    timeout: opts.timeout != null
      ? opts.timeout
      : conf.get('timeout'),
    uid: conf.get('uid'),
    gid: conf.get('gid')
  }).then(res => checkResponse(
    opts.method || 'GET', res, registry, startTime, opts
  ))
}

module.exports.json = fetchJSON
function fetchJSON (uri, opts) {
  return regFetch(uri, opts).then(res => res.json())
}

module.exports.pickRegistry = pickRegistry
function pickRegistry (spec, opts) {
  spec = npa(spec)
  const config = (opts && opts.config) || new Map()
  if (!spec.registry) {
    throw new Error(`${spec} is not a valid registry dependency spec`)
  }
  let registry = spec.scope &&
    config.get(spec.scope.replace(/^@?/, '@') + ':registry')

  if (!registry && config.get('scope')) {
    registry = config.get(
      config.get('scope').replace(/^@?/, '@') + ':registry'
    )
  }

  if (!registry) {
    registry = config.get('registry') || 'https://registry.npmjs.org/'
  }

  return registry
}

function getCacheMode (conf) {
  return conf.get('offline')
    ? 'only-if-cached'
    : conf.get('prefer-offline')
      ? 'force-cache'
      : conf.get('prefer-online')
        ? 'no-cache'
        : 'default'
}

function getHeaders (registry, uri, opts) {
  const headers = Object.assign({
    'npm-in-ci': !!(
      opts.isFromCI ||
      process.env['CI'] === 'true' ||
      process.env['TDDIUM'] ||
      process.env['JENKINS_URL'] ||
      process.env['bamboo.buildKey'] ||
      process.env['GO_PIPELINE_NAME']
    ),
    'npm-scope': opts.projectScope,
    'npm-session': opts.npmSession,
    'user-agent': opts.config.get('user-agent'),
    'referer': opts.refer
  }, opts.headers)
  // check for auth settings specific to this registry
  let auth = (opts.auth && opts.auth[registryKey(registry)]) ||
    opts.auth
  if (!auth) {
    const fromConfig = getAuth(opts.config)
    auth = fromConfig[registryKey(registry)] || fromConfig
  }
  // If a tarball is hosted on a different place than the manifest, only send
  // credentials on `alwaysAuth`
  const shouldAuth = auth && (
    auth.alwaysAuth ||
    url.parse(uri).host === url.parse(registry).host
  )
  if (shouldAuth && auth.token) {
    headers.authorization = `Bearer ${auth.token}`
  } else if (shouldAuth && auth.username && auth.password) {
    const encoded = Buffer.from(
      `${auth.username}:${auth.password}`, 'utf8'
    ).toString('base64')
    headers.authorization = `Basic ${encoded}`
  } else if (shouldAuth && auth._auth) {
    headers.authorization = `Basic ${auth._auth}`
  }
  return headers
}

// Called a nerf dart in the main codebase. Used as a "safe"
// key when fetching registry info from config.
function registryKey (registry) {
  const parsed = url.parse(registry)
  const formatted = url.format({
    host: parsed.host,
    pathname: parsed.pathname,
    slashes: parsed.slashes
  })
  return url.resolve(formatted, '.')
}
