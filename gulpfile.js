const gulp = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

/*----------Server------*/
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        },
        browser: 'chrome'
        // notify: false
    
    });
    gulp.watch('build/**/*').on('change',browserSync.reload);
});

/*------Pug compile------*/
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('sourse/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
  });

/*------------Styles compile----------*/
  gulp.task('styles:compile', function () {
    return gulp.src('sourse/styles/main.scss')
      .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
  });

  /*-------------Sprite-------*/
  gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('sourse/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));
     spriteData.pipe(gulp.dest('build/images/'));
     spriteData.css.pipe(gulp.dest('sourse/styles/global/'));
     cb();
  });

  /*--------------Delete---------*/
  gulp.task('clean', function del(cb) {
      return rimraf('build',cb);
  });

  /*--------------Copy fonts--------*/
  gulp.task('copy:fonts', function() {
      return gulp.src('./sourse/fonts/**/*.*')
      .pipe(gulp.dest('build/fonts'));
  });

  /*-------------Copy images-------*/
  gulp.task('copy:images', function(){
      return gulp.src('./sourse/images/**/*.*')
      .pipe(gulp.dest('build/images'));
  });

  /*---------------Copy------------*/
  gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

  /*----------Watchers-------------*/
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('sourse/styles/**/*.scss', gulp.series('styles:compile'));
  });


  gulp.task('default', gulp.series(
      'clean',
    gulp.parallel('templates:compile','styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
  )
  );