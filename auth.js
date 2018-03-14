'use strict'

const url = require('url')

module.exports = getAuth
function getAuth (registry, conf) {
  if (!registry) { throw new Error('registry is required') }
  if (!conf) { conf = new Map() }
  let AUTH = {}
  const regKey = registry && registryKey(registry)
  const doKey = (key, alias) => addKey(conf, AUTH, regKey, key, alias)
  doKey('_authToken', 'token')
  doKey('username')
  doKey('password')
  doKey('_password', 'password')
  doKey('email')
  doKey('_auth')
  doKey('otp')
  doKey('always-auth', 'alwaysAuth')
  if (AUTH.password) {
    AUTH.password = Buffer.from(AUTH.password, 'base64').toString('utf8')
  }
  AUTH.alwaysAuth = AUTH.alwaysAuth === 'false' ? false : !!AUTH.alwaysAuth
  return AUTH
}

function addKey (conf, obj, scope, key, objKey) {
  if (conf.get(key)) {
    obj[objKey || key] = conf.get(key)
  }
  if (scope && conf.get(`${scope}:${key}`)) {
    obj[objKey || key] = conf.get(`${scope}:${key}`)
  }
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
