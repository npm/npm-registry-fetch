'use strict'

// Find the longest registry key that is used for some kind of auth
// in the options.
const regKeyFromURI = (uri, opts) => {
  const parsed = new URL(uri)
  // try to find a config key indicating we have auth for this registry
  // can be one of :_authToken, :_auth, or :_password and :username
  // We walk up the "path" until we're left with just //<host>[:<port>],
  // stopping when we reach '//'.
  let regKey = `//${parsed.host}${parsed.pathname}`
  while (regKey.length > '//'.length) {
    // got some auth for this URI
    if (hasAuth(regKey, opts))
      return regKey

    // can be either //host/some/path/:_auth or //host/some/path:_auth
    // walk up by removing EITHER what's after the slash OR the slash itself
    regKey = regKey.replace(/([^/]+|\/)$/, '')
  }
}

const hasAuth = (regKey, opts) => (
  opts[`${regKey}:_authToken`] ||
  opts[`${regKey}:_auth`] ||
  opts[`${regKey}:username`] && opts[`${regKey}:_password`]
)

const getAuth = (uri, opts = {}) => {
  const { forceAuth } = opts
  if (!uri)
    throw new Error('URI is required')
  const regKey = regKeyFromURI(uri, forceAuth || opts)

  // we are only allowed to use what's in forceAuth if specified
  if (forceAuth && !regKey) {
    return new Auth({
      token: forceAuth._authToken,
      username: forceAuth.username,
      password: forceAuth._password || forceAuth.password,
      auth: forceAuth._auth || forceAuth.auth,
    })
  }

  // no auth for this URI
  if (!regKey)
    return new Auth({})

  const {
    [`${regKey}:_authToken`]: token,
    [`${regKey}:username`]: username,
    [`${regKey}:_password`]: password,
    [`${regKey}:_auth`]: auth,
  } = opts

  return new Auth({
    token,
    auth,
    username,
    password,
  })
}

class Auth {
  constructor ({ token, auth, username, password }) {
    this.token = null
    this.auth = null
    if (token)
      this.token = token
    else if (auth)
      this.auth = auth
    else if (username && password) {
      const p = Buffer.from(password, 'base64').toString('utf8')
      this.auth = Buffer.from(`${username}:${p}`, 'utf8').toString('base64')
    }
  }
}

module.exports = getAuth
