var gulp = require('gulp'),
    gulpSize = require('gulp-size'),
    gulpMinifyCss = require('gulp-minify-css'),
    gulpImagemin = require('gulp-imagemin'),
    imageminPngQuant = require('imagemin-pngquant'),
    imageminJpegtran = require('imagemin-jpegtran'),
    gulpLivereload = require('gulp-livereload'),
    browserSync = require('browser-sync'),
    gulpJshint = require('gulp-jshint'),
    fs = require('fs'),
    del = require('del'),
    path = require('path'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    historyApiFallback = require('connect-history-api-fallback'),
    uiPort = 8001,
    paths = {
      indexHtmlSource: './src/index.html',
      indexHtmlDist: './dist',
      jsSource: './src/js/speak-easy.js',
      jsFile: 'speak-easy.js',
      jsDist: './dist/js',
      lessSource: './src/styles/speak-easy.css',
      lessDist: './dist/styles',
      imageSource: './src/assets/images/*',
      imageDist: './dist/assets/images',
      fontSource: './src/assets/fonts/*',
      fontDist: './dist/fonts',
      jshintrc: './.jshintrc'
    },
    jshintOptions = fs.readFileSync(paths.jshintrc);

// TODO
// auto-run tests..
// jest

gulp.task('browserify', function() {
  browserify(paths.jsSource)
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      // So gulp watch doesn't crash on js errors
      console.log(err);
      this.emit('end');
    })
    .pipe(source(paths.jsFile))
    .pipe(gulp.dest(paths.jsDist))
    .pipe(gulpSize())
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles', function() {
  return gulp.src(paths.lessSource)
    .pipe(gulpMinifyCss())
    .pipe(gulpSize())
    .pipe(gulp.dest(paths.lessDist))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('image', function() {
  return gulp.src(paths.imageSource)
    .pipe(gulpImagemin({
      progessive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [imageminPngQuant(), imageminJpegtran()]
    }))
    .pipe(gulpSize())
    .pipe(gulp.dest(paths.imageDist))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function() {
  return gulp.src([paths.fontSource])
    .pipe(gulp.dest(paths.fontDist));
});

gulp.task('copyIndexHtml', function() {
  return gulp.src(paths.indexHtmlSource)
    .pipe(gulp.dest(paths.indexHtmlDist))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('lint', function() {
  return gulp.src(paths.jsSource)
    .pipe(gulpJshint(paths.jshintrc))
    .pipe(gulpJshint.reporter('jshint-stylish'));
});

function makeHashKey(file) {
  return [file.contents.toString('utf8'), jshintOptions].join('');
}

gulp.task('clean', function(callback) {
  return del(['./dist'], callback);
});

gulp.task('liveReload', function() {
  gulpLivereload.listen();
  gulp.watch(['./src/js/**/*.js', './src/vendor/**/*.js'], ['browserify', 'lint']);
  gulp.watch('./src/styles/**/*.less', ['styles']);
  gulp.watch('./src/assets/images/**/*.*', ['image']);
  gulp.watch('./src/index.html', ['copyIndexHtml']);
});

gulp.task('server', function() {
  browserSync({
    notify: false,
    port: uiPort,
    open: false,
    server: {
      baseDir: './dist',
      // historyApiFallback let's us serve index.html without a backend
      // server to serve it for us, for development use.
      middleware: [historyApiFallback()]
    }
  })
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['liveReload', 'server', 'browserify','copyIndexHtml', 'styles', 'image', 'fonts', 'lint'])
});

gulp.task('default', function() {
  console.log("Run 'gulp watch'");
});


/**
  ***********************************************
  ************ For production builds ************
  ***********************************************
*/

var buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    productionPaths = {
      indexHtmlSource: './src/index.html',
      indexHtmlDist: './prod-dist',
      jsSource: './src/js/speak-easy.js',
      jsFile: 'speak-easy.js',
      jsDist: './prod-dist/js',
      lessSource: './src/styles/speak-easy.css',
      lessDist: './prod-dist/styles',
      imageSource: './src/assets/images/*',
      imageDist: './prod-dist/assets/images',
      fontSource: './src/assets/fonts/*',
      fontDist: './prod-dist/fonts',
      jshintrc: './.jshintrc'
    }

gulp.task('browserify-production', function() {
  browserify(productionPaths.jsSource)
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      // So gulp watch doesn't crash on js errors
      console.log(err);
      this.emit('end');
    })
    .pipe(source(productionPaths.jsFile))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(productionPaths.jsDist))
    .pipe(gulpSize())
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('copyVendorJS-production', function() {
  return gulp.src('./src/js/smooth-scroll.js')
    .pipe(gulp.dest('./prod-dist/js'))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles-production', function() {
  return gulp.src(productionPaths.lessSource)
    .pipe(gulpMinifyCss())
    .pipe(gulpSize())
    .pipe(gulp.dest(productionPaths.lessDist))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('image-production', function() {
  return gulp.src(productionPaths.imageSource)
    .pipe(gulpImagemin({
      progessive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [imageminPngQuant(), imageminJpegtran()]
    }))
    .pipe(gulpSize())
    .pipe(gulp.dest(productionPaths.imageDist))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts-production', function() {
  return gulp.src([productionPaths.fontSource])
    .pipe(gulp.dest(productionPaths.fontDist));
});

gulp.task('copyIndexHtml-production', function() {
  return gulp.src(productionPaths.indexHtmlSource)
    .pipe(gulp.dest(productionPaths.indexHtmlDist))
    .pipe(gulpLivereload())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('lint-production', function() {
  return gulp.src(productionPaths.jsSource)
    .pipe(gulpJshint(productionPaths.jshintrc))
    .pipe(gulpJshint.reporter('jshint-stylish'));
});

gulp.task('clean-production', function(callback) {
  return del(['./prod-dist'], callback);
});

gulp.task('liveReload-production', function() {
  gulpLivereload.listen();
  gulp.watch(['./src/js/**/*.js', './src/vendor/**/*.js'], ['browserify-production', 'lint-production']);
  gulp.watch('./src/styles/**/*.less', ['styles-production']);
  gulp.watch('./src/assets/images/**/*.*', ['image-production']);
  gulp.watch('./src/index.html', ['copyIndexHtml-production']);
});

gulp.task('server-production', function() {
  browserSync({
    notify: false,
    port: uiPort,
    open: false,
    server: {
      baseDir: './prod-dist',
      // historyApiFallback let's us serve index.html without a backend
      // server to serve it for us, for development use.
      middleware: [historyApiFallback()]
    }
  })
});

gulp.task('build-production', ['clean-production'], function() {
  gulp.start(['browserify-production', 'copyVendorJS-production', 'copyIndexHtml-production', 'styles-production', 'image-production', 'fonts-production', 'lint-production'])
});

// just for testing
gulp.task('watch-production', ['clean-production'], function() {
  gulp.start(['liveReload-production', 'server-production', 'browserify-production', 'copyVendorJS-production', 'copyIndexHtml-production', 'styles-production', 'image-production', 'fonts-production', 'lint-production'])
});

