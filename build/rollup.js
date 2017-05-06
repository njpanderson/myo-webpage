const rollup = require('rollup');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const config = require('./rollup.config');
const generateSpriteJSON = require('./svg-sprite');
const watch = require('node-watch');
const chalk = require('chalk');

const ENVIRONMENT = (process.env.NODE_ENV === 'production') ? 'production' : 'development',
	watch_dir = 'src/';

var cache = {}, prepend;

if (process.argv.indexOf('--watch') !== -1) {
	console.log(chalk.yellow('Watching files in', chalk.white(watch_dir)));

	watch(watch_dir, { recursive: true }, function(event, name) {
		console.log('');
		console.log(chalk.yellow(name + ' changed.'));

		if (!(/\.svg/.test(name))) {
			// not an svg - skip SVG processing
			init({
				ignoreSVGs: true
			});
		} else {
			init();
		}
	});

}

function init(options = {}) {
	// set options
	options = Object.assign({}, {
		ignoreSVGs: false
	}, options);

	// format prepend script
	prepend = fs.readFileSync(path.resolve('build/build-prepend.js'), {
		encoding: 'UTF-8'
	});
	prepend = prepend.replace(/\{\{ ENVIRONMENT \}\}/g, ENVIRONMENT);

	if (!options.ignoreSVGs) {
		console.log(chalk.blue('Building'), 'SVG Sprite...');

		// (re)generate the SVG sprite sheet
		generateSpriteJSON('dist/svg-sprite.json')
			.then(function() {
				startBuild();
			});
	} else {
		startBuild();
	}
}

function startBuild() {
	// get js files within src root and build
	glob('src/*.js', function(error, files) {
		if (error) throw error;
		build(files, 0);
	});
}

// builds an array of files with rollup
function build(files, index) {
	var options, path_dest, file, file_bundle;

	if (index < files.length) {
		file = files[index];
		file_bundle = (path.basename(file)).toLowerCase();
		path_dest = 'dist/';

		console.log(chalk.blue('Rolling up'), file + '...');

		options = Object.assign({}, config, {
			dest: path_dest + file_bundle,
		});

		rollup.rollup({
			entry: file,
			cache: cache[file],
			plugins: options.plugins,
			external: options.external
		}).then(function(bundle) {
			cache[file] = bundle;

			bundle.write({
				format: options.format,
				intro: prepend,
				dest: path_dest + file_bundle,
				sourceMap: options.sourceMap ? 'inline' : false
			});

			build(files, index + 1);
		});
	} else {
		console.log(chalk.green('Rollup complete.'));
	}
}

init();