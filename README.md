# relay-butler

A React Relay CLI that takes in GraphQL fragments and outputs React components.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/relay-butler.svg)](https://npmjs.org/package/relay-butler)
[![Downloads/week](https://img.shields.io/npm/dw/relay-butler.svg)](https://npmjs.org/package/relay-butler)
[![License](https://img.shields.io/npm/l/relay-butler.svg)](https://github.com/richardguerre/relay-butler/blob/master/package.json)

## Get started:

1. Install relay-butler within your project
2. Set up relay-butler by running:

```
relay-butler init
```

3. Makes changes in `.relay-butler/config.js`
4. Make changes to any template in `.relay-butler/templates/`.
5. Add your GraphQL fragments in `.relay-butler/inpug.graphql`
6. Generate your components by running:

```
relay-butler generate
```

### Tips

It is recommended to add a script in package.json, that runs `relay-butler generate` then `relay-compiler` and any other script (e.g. prettier)
For example:

```json
{
  "scripts": {
    // ...
    "relay-butler": "relay-butler generate && relay-compiler && prettier --write src/components/"
  }
}
```

Then you can just run `npm run relay-butler` or `yarn relay-butler`.

## Templates

Templates in `.relay-butler/templates/` use handlebars as the templating language.

- Both the file name and file content are templatable, and have access to the same handlebars context.
- You can refer to `.relay-butler/templateAPI.ts` for the full handlebars context.

## Table of Contents

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g relay-butler
$ relay-butler COMMAND
running command...
$ relay-butler (-v|--version|version)
relay-butler/1.0.0 darwin-x64 node-v12.22.0
$ relay-butler --help [COMMAND]
USAGE
  $ relay-butler COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`relay-butler generate`](#relay-butler-generate)
- [`relay-butler help [COMMAND]`](#relay-butler-help-command)
- [`relay-butler init`](#relay-butler-init)

## `relay-butler generate`

generates component using GraphQL operations in input.graphql and template files in the templates directory.

```
USAGE
  $ relay-butler generate

OPTIONS
  -h, --help  show help for generate command
```

_See code: [src/commands/generate.ts](https://github.com/richardguerre/relay-butler/blob/v1.0.0/src/commands/generate.ts)_

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

sets up relay-butler by creating config.js, templates/\*.hbs files, input.graphql in .relay-butler/ directory.

```
USAGE
  $ relay-butler init

OPTIONS
  -a, --all   generate all template files
  -h, --help  show help for init command
```

_See code: [src/commands/init.ts](https://github.com/richardguerre/relay-butler/blob/v1.0.0/src/commands/init.ts)_

<!-- commandsstop -->
