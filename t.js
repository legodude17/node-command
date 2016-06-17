module.exports = function (args, cb) {
  console.log(args.join(' '));
  cb(null, true);
}