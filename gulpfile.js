const browsersync = require('browser-sync').create();
const del = require('del');
const gulp = require('gulp');
const merge = require('merge-stream');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');

// Defining paths
var module = './node_modules/';
const input = './src/';
const output = './dist/vendor/';

// BrowserSync
const browserSync = (done) => {
	browsersync.init({
		server: {
			baseDir: './',
		},
		port: 3000,
	});
	done();
};

// BrowserSync reload
const browserSyncReload = (done) => {
	browsersync.reload();
	done();
};

// Clean output
const clean = () => del([output]);

// Bring modules from node_modules to output directory
const modules = () => {
	// Bootstrap
	const bootstrap = gulp
		.src(module + 'bootstrap/dist/**/*')
		.pipe(gulp.dest(output + 'bootstrap'));
	// Font Awesome CSS
	const fonts = gulp
		.src(module + '@fortawesome/fontawesome-free/css/**/*')
		.pipe(gulp.dest(output + 'fontawesome-free/css'));
	// Font Awesome Webfonts
	const webFonts = gulp
		.src(module + '@fortawesome/fontawesome-free/webfonts/**/*')
		.pipe(gulp.dest(output + 'fontawesome-free/webfonts'));

	return merge(bootstrap, fonts, webFonts);
};

// CSS task
const css = () =>
	gulp
		.src(input + 'scss/**/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(gulp.dest(input + 'css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCss())
		.pipe(gulp.dest(input + 'css'))
		.pipe(browsersync.stream());

// Watch files
const watchFiles = () => {
	gulp.watch(input + 'scss/**/*', css);
	gulp.watch('./**/*.html', browserSyncReload);
};

// Task sequence defined
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, css);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
