relay-butler
============

A React Relay helper CLI that takes in GraphQL operations and outputs React components with Relay Hooks.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/relay-butler.svg)](https://npmjs.org/package/relay-butler)
[![Downloads/week](https://img.shields.io/npm/dw/relay-butler.svg)](https://npmjs.org/package/relay-butler)
[![License](https://img.shields.io/npm/l/relay-butler.svg)](https://github.com/richardguerre/relay-butler/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g relay-butler
$ relay-butler COMMAND
running command...
$ relay-butler (-v|--version|version)
relay-butler/0.0.5 darwin-x64 node-v12.22.0
$ relay-butler --help [COMMAND]
USAGE
  $ relay-butler COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`relay-butler help [COMMAND]`](#relay-butler-help-command)
* [`relay-butler init`](#relay-butler-init)

## `relay-butler help [COMMAND]`

display help for relay-butler

```
USAGE
  $ relay-butler help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `relay-butler init`

sets up relay-butler by creating config.js, templates/*.hbs files, input.graphql in .relay-butler/ directory.

```
USAGE
  $ relay-butler init

OPTIONS
  -a, --all   generate all template files
  -h, --help  show help for init command
```

_See code: [src/commands/init.ts](https://github.com/richardguerre/relay-butler/blob/v0.0.5/src/commands/init.ts)_
<!-- commandsstop -->
