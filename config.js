'use strict'

const silentLog = require('./silentlog.js')

const OPTION_TRANSLATIONS = {
  'is-from-ci': 'isFromCI',
  'max-sockets': 'maxsockets',
  'project-scope': 'projectScope',
  'npm-session': 'npmSession'
}

const AUTH_REGEX = /^(?:.*:)?(_authToken|username|_password|password|email|always-auth|_auth|otp)$/
const SCOPE_REGISTRY_REGEX = /@.*:registry$/gi
const CONFIGS = new Set([
  'agent',
  'algorithms',
  'body',
  'ca',
  'cache',
  'cert',
  'fetch-retries',
  'fetch-retry-factor',
  'fetch-retry-maxtimeout',
  'fetch-retry-mintimeout',
  'gid',
  'headers',
  'integrity',
  'is-from-ci',
  'key',
  'local-address',
  'log',
  'max-sockets',
  'maxsockets',
  'memoize',
  'method',
  'noproxy',
  'npm-session',
  'offline',
  'otp',
  'prefer-offline',
  'prefer-online',
  'project-scope',
  'Promise',
  'proxy',
  'refer',
  'registry',
  'retry',
  'scope',
  'spec',
  'strict-ssl',
  'timeout',
  'uid',
  'user-agent'
])

class NpmRegistryFetchConfig {
  constructor (opts) {
    opts = opts || {}
    if (opts.opts) {
      this.opts = opts.opts
    } else if (typeof opts.get === 'function') {
      this.opts = {config: opts}
    } else {
      this.opts = opts
    }
    this.config = this.opts.config || new Map()
  }
  get log () { return this.get('log') || silentLog }
  get (opt) {
    if (!CONFIGS.has(opt) && !opt.match(AUTH_REGEX) && !opt.match(SCOPE_REGISTRY_REGEX)) {
      throw new Error(`Invalid config var requested: ${opt}`)
    }
    const key = OPTION_TRANSLATIONS[opt] || opt
    const fromOpts = this.opts[key]
    if (fromOpts !== undefined) {
      return fromOpts
    } else {
      return this.config.get(key)
    }
  }
}

module.exports = config
function config (opts) {
  return new NpmRegistryFetchConfig(opts || {})
}
