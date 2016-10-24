var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function(){

    return gulp.src('./sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('main.css'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['sass'], function(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./sass/**/*.scss', ['sass']);
});
