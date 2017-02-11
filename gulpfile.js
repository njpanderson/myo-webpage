var gulp = require('gulp'),
	del = require('del'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	webpack = require('webpack-stream'),
	plumber = require('gulp-plumber'),
	watch = false;

const env = {
	path_dist: 'public_html/dist'
};

gulp.task('scripts:dev', ['clean'], () => {
	process.env.NODE_ENV = 'development';

	return gulp.src('src/js/bootstrap.js')
		.pipe(plumber())
		.pipe(webpack(
			require('./webpack.config.js'),
			require('webpack')
		))
		.pipe(gulp.dest(env.path_dist + '/js'));
});

gulp.task('scripts:prod', ['clean'], () => {
	process.env.NODE_ENV = 'production';

	return gulp.src('src/js/bootstrap.js')
		.pipe(plumber())
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest(env.path_dist + '/js'));
});

gulp.task('styles', ['clean'], () => {
	return gulp.src('src/styles/main.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(autoprefixer(['last 2 versions', 'Firefox >= 38']))
		.pipe(gulp.dest(env.path_dist + '/css'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(gulp.dest(env.path_dist + '/css'));
});

gulp.task('clean', () => {
	if (!watch) {
		return del([
			env.path_dist
		]);
	} else {
		return true;
	}
});

gulp.task('watch', () => {
	watch = true;
	gulp.watch('src/js/**/*.js*', ['scripts:dev']);
	gulp.watch('src/styles/**/*.scss', ['styles']);
});

gulp.task('dev', ['scripts:dev', 'styles']);
gulp.task('prod', ['scripts:prod', 'styles']);