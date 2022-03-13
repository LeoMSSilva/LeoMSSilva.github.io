const browsersync = require('browser-sync').create();
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');

// BrowserSync
const browserSync = (done) => {
	browsersync.init({ server: { baseDir: './' }, port: 3000 });
	done();
};

// BrowserSync reload
const browserSyncReload = (done) => {
	browsersync.reload();
	done();
};

// CSS task
const css = () =>
	gulp
		.src('./src/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./src/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCss())
		.pipe(gulp.dest('./src/css'))
		.pipe(browsersync.stream());

// Watch files
const watchFiles = () => {
	gulp.watch('./src/scss/**/*', css);
	gulp.watch('./**/*.html', browserSyncReload);
};

// Task sequence defined
const build = gulp.series(css);
const watch = gulp.series(css, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = build;
