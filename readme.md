# node-command [![Build Status][travis-badge]][travis-link] [![Dependency Status][gemnasium-badge]][gemnasium-link]
> A command runner with node support.

## Install

```sh
$ npm install --save node-command
```


## Usage

```js
var nodeCommand = require('node-command');

nodeCommand(
  name, // The name to try
  args, // Arguments to pass
  options, // The options
  cb // Callback
);
```
### Options
#### Silent
Type: `boolean`  
Default: `false`
Suppress all messages.
#### Error log
Type: `boolean`
Default: `false`
Show error messages from `child_process.execFile`.
## CLI

```sh
$ npm install -g node-command
```

```sh
$ nand --help

  Usage: nand [options] -- <file> [args...]
  
  Options:
    -e | --error-log     Log errors from child processes
    -s | --silent        Suppress all messages.
  Example
    nand -e -- node example.js
```
## License

MIT © [legodude17](https://github.com/legodude17)

[travis-badge]: http://img.shields.io/travis/node-command.svg?style=flat-square
[travis-link]: https://travis-ci.org/node-command

[gemnasium-badge]: http://img.shields.io/gemnasium/node-command.svg?style=flat-square
[gemnasium-link]: https://gemnasium.com/node-command
