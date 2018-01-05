var gulp = require('gulp'),
		webserver = require('gulp-webserver'),
		sass = require('gulp-sass'),
		sassGlob = require('gulp-sass-glob'),
		autoprefixer = require('gulp-autoprefixer'),
		plumber = require('gulp-plumber'),
		pug = require('gulp-pug'),
		uglify = require('gulp-uglify'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		rename = require('gulp-rename'),
		es = require('event-stream');

var config = {
	styles: {
		main: 'src/sass/main.scss',
		watch: 'src/sass/**/*.scss',
		output: 'dist/css'
	},
	scripts: {
		main: 'src/js/main.js',
		watch: 'src/js/**/*.js',
		output: 'dist/js'
	},
	html: {
		main: 'src/pug/pages/*.pug',
		watch: 'src/pug/**/*.pug',
		output: 'dist'
	},
  fonts: {
    main: 'src/fonts/**/*',
    output: 'dist/fonts'
  }
}

gulp.task('server', function() {
	gulp.src('./dist')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8000,
			livereload: true
		}))
});

gulp.task('build:css', function () {
	gulp.src(config.styles.main)
		.pipe(plumber())
		.pipe(sassGlob())
		.pipe(sass({
			includePaths: ['node_modules/'],
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(config.styles.output))
})

gulp.task('build:js', function() {
	return browserify(config.scripts.main)
		.bundle()
		.on('error', function (err) {
			this.emit('end')
		})
		.pipe(source('bundle.js'))
		.pipe(rename('main.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(config.scripts.output))
});

gulp.task('build:html', function() {
	gulp.src(config.html.main)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.on('error', function (err) {
      console.error('Error', err.message);
    })
		.pipe(gulp.dest(config.html.output))
});

gulp.task('fonts', function () {
  gulp.src(config.fonts.main)
    .pipe(gulp.dest(config.fonts.output))
})

gulp.task('watch', function() {
	gulp.watch(config.html.watch, ['build:html'])
	gulp.watch(config.styles.watch, ['build:css'])
	gulp.watch(config.scripts.watch, ['build:js'])
});

gulp.task('build', ['build:html', 'build:css', 'build:js'])

gulp.task('default',['server', 'watch', 'build', /*'fonts'*/])