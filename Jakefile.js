var path = require('path');

desc('This is the default task.');
task('default', function (params) {
  console.log('This is the default task.');
});

var buildDir = 'www';

function compileSkewSources(sources, outputFile, moreFlags, done) {
    var cmd = '$(npm bin)/skewc';
    cmd += ' ' + sources.join(' ');
    cmd += ' ' + '--output-file=' + outputFile;

    if (moreFlags !== null) {
        cmd += moreFlags;
    }

    var opts = {
        printStdout: true,
        printStderr: true,
        breakOnError: false
    };

    jake.exec(cmd, opts, done );
}

directory(buildDir);

var sources = [
    'src/imports/2d.sk',
    'src/imports/html.sk',
    'src/imports/igloo.sk',
    'src/imports/typedarray.sk',
    'src/imports/webgl.sk',

    'src/app.sk',
    'src/controller.sk',
    'src/mouse_behaviors.sk',
    'src/rect.sk',
    'src/simulation.sk',
    'src/touch_handlers.sk',
    'src/vector.sk',
    'src/zoom.sk'
];

desc('Build Skew -> Javascript for debug');
task('release', [buildDir], function () {
  var outputFile = path.join(buildDir, 'compiled.js');
  compileSkewSources(sources, outputFile, ' --release', function () {
    jake.cpR('src/glsl', buildDir, complete);
  });
});

desc('Build Skew -> Javascript for debug');
task('debug', [buildDir], function () {
  var outputFile = path.join(buildDir, 'compiled.js');
  compileSkewSources(sources, outputFile, null, function () {
      jake.cpR('src/glsl', buildDir, complete);
  });
});

desc('Watch skew files and compile when they change');
watchTask(['debug'], function () {
  this.watchFiles.include([
    './**/*.sk',
    './**/*.frag',
    './**/*.vert'
  ]);
});
