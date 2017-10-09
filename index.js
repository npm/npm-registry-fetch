'use strict'

const Buffer = require('safe-buffer').Buffer

const fetch = require('make-fetch-happen')
const LRU = require('lru-cache')
const url = require('url')

const WARNING_REGEXP = /^\s*(\d{3})\s+(\S+)\s+"(.*)"\s+"([^"]+)"/
const BAD_HOSTS = new LRU({ max: 50 })

module.exports = regFetch
function regFetch (uri, opts) {
  opts = Object.assign({
    log: silentLog
  }, opts)
  // TODO - need a way to override registry while still passing opts through
  // TODO - this should do some guesswork logic if no registry is passed
  // through that takes into account the scope, the prefix of `uri`, etc
  const registry = opts.registry
  const startTime = Date.now()
  return fetch(uri, {
    agent: opts.agent,
    algorithms: opts.algorithms,
    cache: getCacheMode(opts),
    cacheManager: opts.cache,
    ca: opts.ca,
    cert: opts.cert,
    headers: getHeaders(uri, registry, opts),
    integrity: opts.integrity,
    key: opts.key,
    localAddress: opts.localAddress,
    maxSockets: opts.maxSockets,
    memoize: opts.memoize,
    noProxy: opts.noProxy,
    Promise: opts.Promise,
    proxy: opts.proxy,
    referer: opts.refer,
    retry: opts.retry,
    strictSSL: !!opts.strictSSL,
    timeout: opts.timeout,
    uid: opts.uid,
    gid: opts.gid
  }).then(res => {
    if (res.headers.has('npm-notice') && !res.headers.has('x-local-cache')) {
      opts.log.notice('', res.headers.get('npm-notice'))
    }
    checkWarnings(res, registry, opts)
    if (res.status >= 400) {
      const err = new Error(`${res.status} ${res.statusText}: ${
        opts.spec ? opts.spec : uri
      }`)
      err.code = `E${res.status}`
      err.uri = uri
      err.response = res
      err.spec = opts.spec
      logRequest(uri, res, startTime, opts)
      throw err
    } else {
      res.body.on('end', () => logRequest(uri, res, startTime, opts))
      return res
    }
  })
}

module.exports.json = fetchJSON
function fetchJSON (uri, opts) {
  return regFetch(uri, opts).then(res => res.json())
}

function logRequest (uri, res, startTime, opts) {
  const elapsedTime = Date.now() - startTime
  const attempt = res.headers.get('x-fetch-attempts')
  const attemptStr = attempt && attempt > 1 ? ` attempt #${attempt}` : ''
  const cacheStr = res.headers.get('x-local-cache') ? ' (from cache)' : ''
  opts.log.http(
    'fetch',
    `GET ${res.status} ${uri} ${elapsedTime}ms${attemptStr}${cacheStr}`
  )
}

function getCacheMode (opts) {
  return opts.offline
  ? 'only-if-cached'
  : opts.preferOffline
  ? 'force-cache'
  : opts.preferOnline
  ? 'no-cache'
  : 'default'
}

function getHeaders (uri, registry, opts) {
  const headers = Object.assign({
    'npm-in-ci': opts.isFromCI,
    'npm-scope': opts.projectScope,
    'npm-session': opts.npmSession,
    'user-agent': opts.userAgent,
    'referer': opts.refer
  }, opts.headers)
  // check for auth settings specific to this registry
  let auth = (
    opts.auth &&
    opts.auth[registryKey(registry)]
  ) || opts.auth
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

function checkWarnings (res, registry, opts) {
  if (res.headers.has('warning') && !BAD_HOSTS.has(registry)) {
    const warnings = {}
    res.headers.raw()['warning'].forEach(w => {
      const match = w.match(WARNING_REGEXP)
      if (match) {
        warnings[match[1]] = {
          code: match[1],
          host: match[2],
          message: match[3],
          date: new Date(match[4])
        }
      }
    })
    BAD_HOSTS.set(registry, true)
    if (warnings['199']) {
      if (warnings['199'].message.match(/ENOTFOUND/)) {
        opts.log.warn('registry', `Using stale data from ${registry} because the host is inaccessible -- are you offline?`)
      } else {
        opts.log.warn('registry', `Unexpected warning for ${registry}: ${warnings['199'].message}`)
      }
    }
    if (warnings['111']) {
      // 111 Revalidation failed -- we're using stale data
      opts.log.warn(
        'registry',
        `Using stale data from ${registry} due to a request error during revalidation.`
      )
    }
  }
}

const noop = Function.prototype
function silentLog () {
  return {
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
}
