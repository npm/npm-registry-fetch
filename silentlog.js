'use strict'

const noop = Function.prototype
module.exports = {
  error: noop,
  warn: noop,
  notice: noop,
  info: noop,
  verbose: noop,
  silly: noop,
  http: noop,
  pause: noop,
  resume: noop,
}
