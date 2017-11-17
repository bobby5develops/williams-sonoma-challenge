var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync');

//watch = require('gulp-watch')
//sass = require('gulp-sass')

gulp.task('js', function () {
    return gulp.src('./app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('./app/app.js'))
        .pipe(gulp.dest('build'));
});


gulp.task('browser-sync', function () {
    var files = [
        'app/*.html',
        'app/css/*.css',
        'app/img/**/*.png',
        'app/img/*.jpg',
        'app/js/*.js',
        'app/js/data/.json'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './app'
        }
    });
});

