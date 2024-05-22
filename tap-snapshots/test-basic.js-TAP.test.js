/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/basic.js TAP run through the fixtures apple-keys > must match snapshot 1`] = `
Object {
  "footer": Object {
    "0": Object {
      "name": "mcintosh",
    },
    "1": Object {
      "name": "honeycrisp",
    },
    "2": null,
    "color": Object {},
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "name": "eggs",
    "noValue": false,
    "types": null,
  },
  "header": Object {
    "0": 1,
    "1": 2,
    "2": 3,
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "title": "hello world",
  },
}
`

exports[`test/basic.js TAP run through the fixtures apple-keys > must match snapshot 2`] = `
Array [
  Object {
    "key": "value",
    "path": Array [
      "rows",
      "corn",
      "value",
    ],
    "value": "high",
  },
  Object {
    "key": "value",
    "path": Array [
      "rows",
      "corn",
      "color",
      "value",
    ],
    "value": "yellow",
  },
  Object {
    "key": "value",
    "path": Array [
      "rows",
      "apples",
      "types",
      0,
      "value",
    ],
    "value": "pies",
  },
  Object {
    "key": "value",
    "path": Array [
      "rows",
      "apples",
      "types",
      1,
      "value",
    ],
    "value": "eating",
  },
  Object {
    "key": "value",
    "path": Array [
      "rows",
      "apples",
      "types",
      2,
      "value",
    ],
    "value": Object {
      "baking": "adds protien",
      "frying": "adds eggy",
      "price": "$0.75",
    },
  },
]
`

exports[`test/basic.js TAP run through the fixtures apple-map > must match snapshot 1`] = `
Object {
  "footer": Object {
    "0": Object {
      "name": "mcintosh",
    },
    "1": Object {
      "name": "honeycrisp",
    },
    "2": null,
    "color": Object {},
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "name": "eggs",
    "noValue": false,
    "types": null,
  },
  "header": Object {
    "0": 1,
    "1": 2,
    "2": 3,
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "title": "hello world",
  },
}
`

exports[`test/basic.js TAP run through the fixtures apple-map > must match snapshot 2`] = `
Array [
  Object {
    "key": "value",
    "value": "HIGH",
  },
  Object {
    "key": "value",
    "value": "YELLOW",
  },
  Object {
    "key": "value",
    "value": "PIES",
  },
  Object {
    "key": "value",
    "value": "EATING",
  },
]
`

exports[`test/basic.js TAP run through the fixtures apple-values > must match snapshot 1`] = `
Object {
  "footer": Object {
    "0": Object {
      "name": "mcintosh",
    },
    "1": Object {
      "name": "honeycrisp",
    },
    "2": null,
    "color": Object {},
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "name": "eggs",
    "noValue": false,
    "types": null,
  },
  "header": Object {
    "0": 1,
    "1": 2,
    "2": 3,
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "title": "hello world",
  },
}
`

exports[`test/basic.js TAP run through the fixtures apple-values > must match snapshot 2`] = `
Array [
  "high",
  "yellow",
  "pies",
  "eating",
  Object {
    "baking": "adds protien",
    "frying": "adds eggy",
    "price": "$0.75",
  },
]
`

exports[`test/basic.js TAP run through the fixtures bad-path-entry > must match snapshot 1`] = `
Object {
  "header": Object {
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "title": "hello world",
  },
}
`

exports[`test/basic.js TAP run through the fixtures bad-path-entry > must match snapshot 2`] = `
Array []
`

exports[`test/basic.js TAP run through the fixtures dive-into-value > must match snapshot 1`] = `
Object {
  "header": Object {
    "0": Object {
      "name": "mcintosh",
      "value": "pies",
    },
    "1": Object {
      "name": "honeycrisp",
      "value": "eating",
    },
    "2": null,
    "3": null,
    "apples": Object {
      "types": Array [
        Object {
          "name": "mcintosh",
          "value": "pies",
        },
        Object {
          "name": "honeycrisp",
          "value": "eating",
        },
        Object {
          "name": "eggs",
          "value": Object {
            "baking": "adds protien",
            "frying": "adds eggy",
            "price": "$0.75",
          },
        },
        Object {
          "name": "peas",
          "value": Object {
            "boiling": "makes greeny",
          },
        },
      ],
      "value": "crunchysweet",
    },
    "beans": Object {
      "noValue": false,
    },
    "color": Object {
      "value": "yellow",
    },
    "corn": Object {
      "color": Object {
        "value": "yellow",
      },
      "value": "high",
    },
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "name": "peas",
    "noValue": false,
    "title": "hello world",
    "types": Array [
      Object {
        "name": "mcintosh",
        "value": "pies",
      },
      Object {
        "name": "honeycrisp",
        "value": "eating",
      },
      Object {
        "name": "eggs",
        "value": Object {
          "baking": "adds protien",
          "frying": "adds eggy",
          "price": "$0.75",
        },
      },
      Object {
        "name": "peas",
        "value": Object {
          "boiling": "makes greeny",
        },
      },
    ],
  },
}
`

exports[`test/basic.js TAP run through the fixtures dive-into-value > must match snapshot 2`] = `
Array []
`

exports[`test/basic.js TAP run through the fixtures no-path > must match snapshot 1`] = `
Object {}
`

exports[`test/basic.js TAP run through the fixtures no-path > must match snapshot 2`] = `
Array [
  Object {
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "rows": Object {
      "apples": Object {
        "types": Array [
          Object {
            "name": "mcintosh",
            "value": "pies",
          },
          Object {
            "name": "honeycrisp",
            "value": "eating",
          },
          Object {
            "name": "eggs",
            "value": Object {
              "baking": "adds protien",
              "frying": "adds eggy",
              "price": "$0.75",
            },
          },
        ],
      },
      "beans": Object {
        "noValue": false,
      },
      "corn": Object {
        "color": Object {
          "value": "yellow",
        },
        "value": "high",
      },
      "value": Array [
        1,
        2,
        3,
      ],
    },
    "title": "hello world",
  },
]
`

exports[`test/basic.js TAP run through the fixtures number-path-entry > must match snapshot 1`] = `
Object {
  "header": Object {
    "apples": Object {
      "types": Array [
        Object {
          "name": "mcintosh",
          "value": "pies",
        },
        Object {
          "name": "honeycrisp",
          "value": "eating",
        },
        Object {
          "name": "eggs",
          "value": Object {
            "baking": "adds protien",
            "frying": "adds eggy",
            "price": "$0.75",
          },
        },
      ],
    },
    "beans": Object {
      "noValue": false,
    },
    "corn": Object {
      "color": Object {
        "value": "yellow",
      },
      "value": "high",
    },
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "title": "hello world",
    "value": Array [
      1,
      2,
      3,
    ],
  },
}
`

exports[`test/basic.js TAP run through the fixtures number-path-entry > must match snapshot 2`] = `
Array []
`

exports[`test/basic.js TAP run through the fixtures path-no-match > must match snapshot 1`] = `
Object {
  "header": Object {
    "foot": Object {
      "count": 2,
      "toes": 5,
    },
    "header": Object {
      "eyes": 2,
      "mouth": 1,
      "nose": "more than enough",
    },
    "rows": Object {
      "apples": Object {
        "types": Array [
          Object {
            "name": "mcintosh",
            "value": "pies",
          },
          Object {
            "name": "honeycrisp",
            "value": "eating",
          },
          Object {
            "name": "eggs",
            "value": Object {
              "baking": "adds protien",
              "frying": "adds eggy",
              "price": "$0.75",
            },
          },
        ],
      },
      "beans": Object {
        "noValue": false,
      },
      "corn": Object {
        "color": Object {
          "value": "yellow",
        },
        "value": "high",
      },
      "value": Array [
        1,
        2,
        3,
      ],
    },
    "title": "hello world",
  },
}
`

exports[`test/basic.js TAP run through the fixtures path-no-match > must match snapshot 2`] = `
Array []
`
