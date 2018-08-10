const config       = require('config');
const fs           = require('fs');
const gulp         = require('gulp');
const del          = require('del');
const {join}       = require('path');
const log          = require('fancy-log');
const ejs          = require('gulp-ejs');
const webpack      = require('webpack');
const browserSync  = require('browser-sync').create();
const {plugins, ...baseConf}  = require('./webpack.config');
const {DllReferencePlugin, DllPlugin} = webpack;
const {src, output, vendors} = config;

const manifest = join(output, 'vendor.manifest.json');
const htmlFile = join(src, '*.?(ejs|html)');
const bundler = (config, done) => webpack(config, (err, stats) => {
  if(err) return done(err);
  log.info(`[webpack:${config.name}]\n${stats.toString({colors: true, warnings: false})}`);
  return done();
});

gulp.task('clean', () => del(output));

gulp.task('webpack:dll', (done) => !vendors ? done() :
  bundler({
    ...baseConf,
    name: 'dll',
    devtool: 'cheap-module-source-map',
    entry: vendors,
    output: {
      path: output,
      filename: 'vendor.dll.js',
      library: 'vendor_dll_[hash:8]',
    },
    plugins: [
      ...plugins,
      new DllPlugin({
        name: 'vendor_dll_[hash:8]',
        path: manifest,
      }),
    ]
  }, done)
);

gulp.task('webpack:app', (done) => {
  let exists = fs.existsSync(manifest);
  return bundler(exists ? {
    ...baseConf,
    plugins: [
      ...plugins,
      new DllReferencePlugin({
        manifest,
      })
    ]
  } : {...baseConf, plugins}, done);
});

gulp.task('html', () =>
  gulp.src(htmlFile)
    .pipe(ejs({dll: fs.existsSync(manifest), ...config}, {}, {ext: '.html'}))
    .pipe(gulp.dest(output))
);

gulp.task('build', gulp.series('clean', 'webpack:dll', 'webpack:app', 'html'));

gulp.task('serve', (done) => {
  browserSync.init({
    server: [output, src],
  });
  browserSync.watch(output).on('change', browserSync.reload);
  return done();
});

gulp.task('watch', (done) => {
  let allPath=findSync(src);
  for(let i=0;i<allPath.length;i++)
  {
    if(allPath[i].indexOf('.html')>-1)
    {
      gulp.watch(allPath[i],gulp.series('html'));
    }
    else{
      gulp.watch(allPath[i],gulp.series('webpack:app'));
    }
  }
  // gulp.watch([join(src, '**/*'), '!' + htmlFile], gulp.series('webpack:app'));
  // gulp.watch(htmlFile, gulp.series('html'));
  done();
});

gulp.task('default', gulp.series('build', 'serve', 'watch'));

//TODO: test & zip & cdn
//get files path
function findSync(startPath) {
  let result=[];
  function finder(path) {
    let files=fs.readdirSync(path);
    files.forEach((val,index) => {
      let fPath=join(path,val);
      let stats=fs.statSync(fPath);
      if(stats.isDirectory()) finder(fPath);
      if(stats.isFile()) result.push(fPath);
    });

  }
  finder(startPath);
  return result;
}
