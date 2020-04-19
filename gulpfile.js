const { src, series } = require('gulp'),
  eslint = require('gulp-eslint'),
  mocha = require('gulp-mocha');

function lint() {
  return src(['./*.js', './test/*.js'])
    .pipe(eslint({ node: true, mocha: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function test() {
  return src('test/*.spec.js', { read: false }).pipe(mocha({ timeout: 5000 }));
}

exports.default = series(lint, test);
