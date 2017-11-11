const gulp = require('gulp')
const babel = require('gulp-babel')

gulp.task('default', () =>
  gulp.src('core/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
)
