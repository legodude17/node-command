#!/usr/bin/node
'use strict';

var pkg = require('./package.json');
var nodeCommand = require('./');
var argv = process.argv.slice(2);
var minimist = require('minimist');
argv = minimist(argv, {
  alias: {
    'h': 'help',
    'v': 'version',
    's': 'silent',
    'e': 'error-log'
  }
});
function help() {
  console.log([
    '',
    '  ' + pkg.description,
    '',
    '  Example',
    '    nand ',
    ''
  ].join('\n'));
}

if (argv.help) {
  help();
  return;
}

if (argv.version) {
  console.log(pkg.version);
  return;
}
nodeCommand(argv._.shift(), argv._, {
  silent: argv.silent,
  logError: argv['error-log']
}, process.exit);