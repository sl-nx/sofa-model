var { src, series } = require('gulp'), 
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  mocha = require('gulp-mocha');

function lint() {
  return src(['./*.js', './test/*.js'])
    .pipe(jshint({ node: true, mocha: true }))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
}

function test() {
  return src('test/*.spec.js', { read: false }).pipe(mocha({ timeout: 5000 }));
}

exports.default = series(lint, test);
