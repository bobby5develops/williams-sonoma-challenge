var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var reload = browserSync.reload;
var config = {
    input: './app/scss/app.scss',
    output: './distribution/css/'
};
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Copy any html files in app/ to distribution/
gulp.task('copyHtml', function() {
    gulp.src('app/*.html').pipe(gulp.dest('distribution'));
});

//images
gulp.task('img', function () {
    gulp.src('app/img/*.png')
        .pipe(gulp.dest('distribution/img/'));
});


// Compile Sass
gulp.task('sass', function() {
    return gulp.src(config.input)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest(config.output))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./')) //.pipe(sourcemaps.write('./'))
        .pipe(browserSync.reload({ stream: true}));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build-data', function () {
    return gulp.src('app/js/model/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('dealers.json'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('distribution/js/model/'));
});



// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task('serve', ['lint', 'sass', 'scripts'], function() {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });

    gulp.watch('js/*.js', ['lint', 'scripts']).on('change', browserSync.reload);
    gulp.watch('scss/*.scss', ['sass']).on('change', function (event) {
        console.log(event.type + '' + event.path);
        return browserSync.reload;
    });
    gulp.watch('/*.html').on('change', browserSync.reload);
    //define watch task
    gulp.watch(['./app/*.html', config.input, './app/js/*.js', './app/js/data/*.json'],
        {cwd: 'app'},
        reload);
});


// Default Tasks
gulp.task('default', ['serve']);
