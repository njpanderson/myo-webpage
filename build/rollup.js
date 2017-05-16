const rollup = require('rollup'),
	path = require('path'),
	fs = require('fs'),
	glob = require('glob'),
	generateSpriteJSON = require('./svg-sprite'),
	watch = require('node-watch'),
	chalk = require('chalk'),
	babili = require('rollup-plugin-babili'),
	watch_dir = 'src/',
	dist_dir = 'dist/',
	formats = {
		cjs: require('./rollup.config'),
		iife: require('./rollup.config.iife')
	};

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

	// ensure dist/ path exists
	if (!fs.existsSync(dist_dir)){
		fs.mkdirSync(dist_dir);
	}

	if (!options.ignoreSVGs) {
		console.log(chalk.blue('Building'), 'SVG Sprite...');

		// (re)generate the SVG sprite sheet
		generateSpriteJSON(dist_dir + 'svg-sprite.json')
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
		build(files);
	});
}

// builds an array of files with rollup
function build(files) {
	var tasks = [],
		key;

	files.forEach(function(file) {
		for (key in formats) {
			if (key === 'iife') {
				// produce minified as well as standard output
				tasks.push(build_file(key, file));

				if (process.env.NODE_ENV === 'production') {
					tasks.push(build_file(key, file, true));
				}
			} else {
				tasks.push(build_file(key, file));
			}
		}
	});

	Promise.all(tasks)
		.then(function() {
			console.log(chalk.green('Rollup complete.'));
		});
}

function build_file(format, file, minified = false) {
	var config = formats[format],
		plugins = config.plugins.slice(),
		file_bundle, dest_path;

	console.log(
		chalk.blue('Rolling up'),
		file + ' (' + format + (minified ? ', minified' : '') + ')...'
	);

	file_bundle = path.basename(file);
	file_bundle = file_bundle.substr(0, file_bundle.lastIndexOf('.'));

	cache[format] = cache[format] || {};

	if (minified) {
		plugins.push(
			babili({
				comments: false
			})
		);

		dest_path = dist_dir + (file_bundle + '.' + format + '.min.js').toLowerCase();
	} else {
		dest_path = dist_dir + (file_bundle + '.' + format + '.js').toLowerCase();
	}

	return rollup.rollup(Object.assign({}, config.rollup, {
		entry: file,
		cache: cache[format][file],
		plugins: plugins
	}))
		.then(function(bundle) {
			var opts = {
				intro: prepend,
				dest: dest_path,
			};

			cache[file] = bundle;

			if (config.write.format === 'iife') {
				if (file_bundle === 'Index') {
					config.write.moduleName = 'window.Tag';
				} else {
					config.write.moduleName = 'window.Tag.' + file_bundle;
				}
			}

			bundle.write(Object.assign({}, config.write, opts));
		})
		.catch(function(error) {
			console.error(error);
			process.exit(1);
		});
}

init();