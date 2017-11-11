import gulp from 'gulp'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import xo from 'gulp-xo'

gulp.task('xo', () => {
  return gulp.src('./core/**/*.js')
    .pipe(xo())
    .pipe(xo.failAfterError())
})

// Copy files other than JS
gulp.task('others', () => {
  return gulp
    .src(['core/**/*', '!core/**/*.js'])
    .pipe(gulp.dest('./dist'))
})

// Babel JS files
gulp.task('babel', () => {
  gulp.src('core/**/*.js')
    .pipe(babel())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['xo', 'babel', 'others'])
