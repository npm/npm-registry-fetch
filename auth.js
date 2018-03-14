'use strict'

module.exports = getAuth
function getAuth (conf) {
  const AUTH = {}
  const iterator = typeof conf.forEach === 'function'
    ? conf
    : conf.keys
  iterator.forEach((k) => {
    const authMatchGlobal = k.match(
      /^(_authToken|username|_password|password|email|always-auth|_auth)$/
    )
    const authMatchScoped = k[0] === '/' && k.match(
      /(.*):(_authToken|username|_password|password|email|always-auth|_auth)$/
    )

    // if it matches scoped it will also match global
    if (authMatchGlobal || authMatchScoped) {
      let nerfDart = null
      let key = null
      let val = null

      if (authMatchScoped) {
        nerfDart = authMatchScoped[1]
        key = authMatchScoped[2]
        val = conf.get(k)
        if (!AUTH[nerfDart]) {
          AUTH[nerfDart] = {
            alwaysAuth: !!conf.get('always-auth')
          }
        }
      } else {
        key = authMatchGlobal[1]
        val = conf.get(k)
        AUTH.alwaysAuth = !!conf.get('always-auth')
      }

      const auth = authMatchScoped ? AUTH[nerfDart] : AUTH
      if (key === '_authToken') {
        auth.token = val
      } else if (key.match(/password$/i)) {
        auth.password =
        // the config file stores password auth already-encoded. pacote expects
        // the actual username/password pair.
        Buffer.from(val, 'base64').toString('utf8')
      } else if (key === 'always-auth') {
        auth.alwaysAuth = val === 'false' ? false : !!val
      } else {
        auth[key] = val
      }
    }
  })
  return AUTH
}
