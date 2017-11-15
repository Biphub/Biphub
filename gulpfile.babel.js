import gulp from 'gulp'
import babel from 'gulp-babel'
import clean from 'gulp-clean'
import runSequence from 'run-sequence'
import sourcemaps from 'gulp-sourcemaps'
import path from 'path'

// Copy files other than JS
gulp.task('others', () => {
  return gulp
    .src(['core/**/*', '!core/**/*.js'])
    .pipe(gulp.dest('dist'))
})

const paths = {
  sourceRoot: path.join(__dirname, 'core')
}

// Babel JS files
gulp.task('babel', () => {
  gulp.src('core/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: paths.sourceRoot }))
    .pipe(gulp.dest('dist'))
})

gulp.task('build-clean', () => {
  gulp.src('dist')
    .pipe(clean({ force: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', (cb) => {
  runSequence(
    'build-clean',
    'babel',
    'others',
    cb
  )
})
