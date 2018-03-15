# npm-registry-fetch [![npm version](https://img.shields.io/npm/v/npm-registry-fetch.svg)](https://npm.im/npm-registry-fetch) [![license](https://img.shields.io/npm/l/npm-registry-fetch.svg)](https://npm.im/npm-registry-fetch) [![Travis](https://img.shields.io/travis/npm/npm-registry-fetch/latest.svg)](https://travis-ci.org/npm/npm-registry-fetch) [![AppVeyor](https://img.shields.io/appveyor/ci/npm/npm-registry-fetch/latest.svg)](https://ci.appveyor.com/project/npm/npm-registry-fetch) [![Coverage Status](https://coveralls.io/repos/github/npm/npm-registry-fetch/badge.svg?branch=latest)](https://coveralls.io/github/npm/npm-registry-fetch?branch=latest)

[`npm-registry-fetch`](https://github.com/npm/npm-registry-fetch) is a Node.js
library that implements a `fetch`-like API for accessing npm registry APIs
consistently.

## Install

`$ npm install npm-registry-fetch`

## Table of Contents

* [Example](#example)
* [Contributing](#contributing)
* [API](#api)
  * [`fetch`](#fetch)
  * [`fetch.json`](#fetch-json)

### Example

```javascript
const npmFetch = require('npm-registry-fetch')

console.log(
  await npmFetch.json('https://registry.npmjs.org/-/ping')
)
```

### Contributing

The npm team enthusiastically welcomes contributions and project participation!
There's a bunch of things you can do if you want to contribute! The [Contributor
Guide](CONTRIBUTING.md) has all the information you need for everything from
reporting bugs to contributing entire new features. Please don't hesitate to
jump in if you'd like to, or even ask us questions if something isn't clear.

All participants and maintainers in this project are expected to follow [Code of
Conduct](CODE_OF_CONDUCT.md), and just generally be excellent to each other.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.

Happy hacking!

### API

#### <a name="fetch"></a> `> fetch(url, [opts]) -> Promise<Response>`

Performs a request to a given registry URL.

##### Example

```javascript
const fetch = require('npm-registry-fetch')
const res = await fetch('https://registry.npmjs.org/-/ping')
console.log(res.headers)
res.on('data', d => console.log(d.toString('utf8')))
```

#### <a name="fetch"></a> `> fetch.json(url, [opts]) -> Promise<ResponseJSON>`

Performs a request to a given registry URL, parses the body of the response as
JSON, and returns it as its final value. This is a utility shorthand for
`fetch(url).then(res => res.json())`.

##### Example

```javascript
const fetch = require('npm-registry-fetch')
const res = await fetch.json('https://registry.npmjs.org/-/ping')
console.log(res)
```
