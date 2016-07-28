'use strict';
var path = require('path');
var async = require('async');
var ASQ = require('asynquence');
var isExe = require('is-executable');
var execute = require('child_process').execFile;
var getArgNames = require('function-args');
var names = require('common-callback-names')
function call(fn, args, cb, context) {
  var argNames = getArgNames(fn);
  var finalArgs = [];
  argNames.forEach(function (v) {
    v = v.trim();
    if (v === 'args') {
      finalArgs.push(args);
    } else if (names.includes(v)) {
      finalArgs.push(cb);
    } else {
      finalArgs.push(args.shift());
    }
  });
  try {
    fn.apply(context || Object.create(null), finalArgs);
  } catch (e) {cb(); }
}
module.exports = function(file, args, options, cb){
  options = options || {};
  ASQ(function (done) {
    isExe(file).then(function (res) {
      if (res) {
        execute(file, args, function (error, stdout, stderr) {
            if (error && options.logErrors) {
              console.error(error);
            }
            if (!options.silent) {
              stdout.length && console.log(stdout);
              stderr.length && console.error(stderr.length);
            }
            done(true);
          });
      } else {
        done();
      }
    }, done.fail);
  }).then(function (done, msg) {
    if (msg) {
      done(msg);
    }
    isExe(path.join(process.cwd(), 'node_modules', '.bin', file), function (res) {
      execute(file, args, function (error, stdout, stderr) {
        if (error && options.logErrors) {
          console.error(error);
        }
        if (!options.silent) {
          stdout.length && console.log(stdout);
          stderr.length && console.error(stderr.length);
        }
        done(true);
      });
    });
  }).then(function (done, msg) {
    if (msg) {
      return done(msg);
    }
    var good = false;
    var arr = process.env.PATH.split(path.delimiter);
    async.forEachOf(arr, function (v, i, cb) {
      isExe(path.join(v, file)).then(function (res) {
        if (res) {
          execute(path.join(v, file), args, function (error, stdout, stderr) {
            if (error && options.logErrors) {
              console.error(error);
            }
            good = true;
            if (!options.silent) {
              stdout.length && console.log(stdout);
              stderr.length && console.error(stderr);
            }
            cb();
          });
        } else {
          cb();
        }
      }, done.fail);
    }, function (err) {
      if (err) {
        return done.fail(err);
      }
      done(good);
    });
  }).then(function (done, msg) {
    if (msg) {
      return done(true);
    }
    try {
      var path = require.resolve(file);
    } catch(e) {
      return done(false);
    }
    if (path) {
      if (options.silent) {
        var log = console.log, error = console.error;
        console.log = console.error = function (){};
      }
      call(require(path), args, done.errfcb);
      setTimeout(done, options.timeout || 10000);
      if (options.silent) {
        console.log = log;
        console.error = error;
      }
    } else {
      done(false);
    }
  }).then(function (done, msg) {
    cb(null, msg);
  });
};