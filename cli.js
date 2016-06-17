#!/usr/bin/node
'use strict';

var pkg = require('./package.json');
var nodeCommand = require('./');
var argv = process.argv.slice(2);

function help() {
  console.log([
    '',
      '  ' + pkg.description,
    '',
    '  Example',
    '    node-command ',
    ''
  ].join('\n'));
}

function isOn(a) {
  return argv.includes('--' + a);
}

if (argv.indexOf('--help') !== -1) {
  help();
  return;
}

if (argv.indexOf('--version') !== -1) {
  console.log(pkg.version);
  return;
}


nodeCommand(argv.shift(), argv, {
  silent: isOn('silent'),
  logError: isOn('error-log')
}, function(){

});