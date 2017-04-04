var fs = require('fs'),
    browserify = require('browserify'),
    watchify = require('watchify');

var b = browserify('./lib/clientside/app.jsx')
  .transform('babelify', {presets: ['es2015', 'react']})
  .plugin(watchify)
  .on('error', function (err) {
    return console.error(err.message);
  })
  .on('update', bundle);

bundle([]);

function bundle(ids) {
  console.log('Changed bundles: ' + ids.join(' '));
  b.bundle()
    .pipe(fs.createWriteStream('./public/scripts/app.js'));
}
