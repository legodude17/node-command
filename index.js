'use strict';
var path = require('path');
var async = require('async');
var ASQ = require('asynquence');
var isExe = require('is-executable');
var execute = require('child_process').execFile;
module.exports = function(file, args, options, cb){
  options = options || {};
  ASQ(function (done) {
    var good = false;
    var arr = process.env.PATH.split(path.delimiter);
    async.forEachOf(arr.concat('--color'), function (v,i, cb) {
      isExe(path.join(v, file)).then(function (res) {
        if (res) {
          var cp = execute(path.join(v, file), args, function (error, stdout, stderr) {
            if (error && options.logErrors) {
              console.error(error);
            }
            good = true;
            if (!options.silent) {
              console.log(stdout);
              console.error(stderr);
            }
            cb();
          });
        } else {
          cb();
        }
      }, function (err) {done.fail(err); })
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
      require(path)(args, done.errfcb);
      setTimeout(done, options.timeout || 10000);
      if (options.silent) {
        console.log = log;
        
      }
    } else {
      done(false);
    }
  }).then(function (done, msg) {
    if (msg) {
      console.log('Good');
    } else {
      console.error('Boo :(');
    }
  })
};
