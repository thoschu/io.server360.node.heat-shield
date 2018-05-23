heat-shield 
=========
(lost in beta)

[![npm version](https://badge.fury.io/js/heat-shield.svg)](https://badge.fury.io/js/heat-shield)
[![Dependency Status](https://david-dm.org/thoschu/io.server360.node.heat-shield.svg)](https://david-dm.org/thoschu/io.server360.node.heat-shield)
[![Dev Dependency Status](https://david-dm.org/thoschu/io.server360.node.heat-shield/dev-status.svg)](https://david-dm.org/thoschu/io.server360.node.heat-shield?type=dev)
[![Build Status](https://travis-ci.org/thoschu/io.server360.node.heat-shield.svg?branch=master)](https://travis-ci.org/thoschu/io.server360.node.heat-shield)
[![Coverage Status](https://coveralls.io/repos/github/thoschu/io.server360.node.heat-shield/badge.svg?branch=feature%2Finitial)](https://coveralls.io/github/thoschu/io.server360.node.heat-shield?branch=feature%2Finitial)
[![Maintainability](https://api.codeclimate.com/v1/badges/bfdfba1769e771f614d1/maintainability)](https://codeclimate.com/github/thoschu/io.server360.node.heat-shield/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/bfdfba1769e771f614d1/test_coverage)](https://codeclimate.com/github/thoschu/io.server360.node.heat-shield/test_coverage)
[![GitHub issues](https://img.shields.io/github/issues/thoschu/io.server360.node.heat-shield.svg)](https://github.com/thoschu/io.server360.node.heat-shield/issues)
[![GitHub license](https://img.shields.io/github/license/thoschu/io.server360.node.heat-shield.svg)](https://github.com/thoschu/io.server360.node.heat-shield/blob/master/LICENSE)

[![NPM Badge](https://nodei.co/npm/heat-shield.png?downloads=true)](https://www.npmjs.com/package/heat-shield)

<img src="http://i63.tinypic.com/vgj6dj.jpg" width="196" height="196" align="right" hspace="12" />

> The audit command submits a description of the dependencies configured in your project to your default registry and asks for a report of known vulnerabilities. 
The report returned includes instructions on how to act on this information. Heat-shield automatically solves these security vulnerabilities by suggested patches.

## Installation

Via [npm](https://www.npmjs.com/):

```bash
$ npm install heat-shield
```

## Using in [Node.js](https://nodejs.org/),  respectively [package.json](https://docs.npmjs.com/files/package.json):

```javascript
...
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "fix": "heat-shield",
    "postinstall": "heat-shield"
  },
...
```

## Using the `heat-shield` binary

### To use the `heat-shield` binary in your shell, simply install heat-shield globally using npm:
```bash
$ npm install -g heat-shield 
```

### After that you’re able to count from the command line:
(Please note, you have to be in the directory with the npm-shrinkwrap.json or package-lock.json.)
```bash
$ heat-shield
...
```

## Tests
`npm test`

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

***

## NPM

[https://www.npmjs.com/package/heat-shield](https://www.npmjs.com/package/heat-shield)

***

## GitHub

[https://github.com/thoschu/io.server360.node.heat-shield](https://github.com/thoschu/io.server360.node.heat-shield)

***