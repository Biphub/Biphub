var shell = require('shelljs');

shell.cp('-R', 'core/public/js/lib', 'dist/public/js/');
shell.cp('-R', 'core/public/fonts', 'dist/public/');
shell.cp('-R', 'core/public/images', 'dist/public/');
