const fs = require('fs'),
	chalk = require('chalk'),
	glob = require('glob'),
	child_exec = require('child_process').exec,
	Rsync = require('rsync'),
	file_settings = './.rsync.json',
	package_files = 'dist/*.iife.js',
	git_cli_commands = {
		branch: 'git rev-parse --abbrev-ref HEAD',
		tag: 'git describe --abbrev=0 --tags'
	};

if (process.env.CI_ENV && process.env.CI_ENV === 'TRAVIS') {
	console.log(chalk.yellow('Skipping packaging within CI environment...'));
	process.exit();
}

init(upload);

function init(after) {
	var options;

	if (fs.existsSync(file_settings)) {
		try {
			options = fs.readFileSync(file_settings);
			options = JSON.parse(options);

			['host', 'user', 'path'].forEach((prop) => {
				if (!options[prop]) {
					throw new Error(
						'Options property ' + chalk.yellow(prop) + ' is missing. Have you set it in the .rsync.json file?'
					);
				}
			});
		} catch(e) {
			console.log(chalk.red('.rsync.json could not be parsed. cancelling packaging.'), e.message);
			process.exit(1);
		}

		// populate git properties
		get_git_data_by_cmd(git_cli_commands, (data) => {
			// fire callback
			after(options, data);
		});
	} else {
		console.log(chalk.yellow('.rsync.json is missing', chalk.white('- Skipping packaging process...')));
		process.exit();
	}
}

function get_git_data_by_cmd(commands, after) {
	var results = 0,
		keys = Object.keys(commands),
		data = {};

	keys.forEach((key) => {
		child_exec(commands[key], (error, stdout) => {
			if (error) {
				console.error(error.message);
				process.exit(error.code);
			}

			results += 1;

			// console.log(key, stdout, results);
			data[key] = stdout.trim();

			if (results === keys.length) {
				after(data);
			}
		});
	});
}

/**
 * Upload the globbed files given host `options`
 */
function upload(options, git_data) {
	var rsync = new Rsync();

	// glob files
	glob(package_files, {
		absolute: true
	}, function(error, files) {
		var dest, path;

		if (error) throw error;

		console.log(chalk.green('Uploading ' + files.length + ' packages to ' + options.host + '...'));

		path = options.path + '/' + git_data.branch + '/' + git_data.tag;
		dest = (options.user ? options.user + '@' : '') +
			options.host + ':' + path;

		rsync
			.flags('z')
			.set('rsync-path', 'mkdir -p ' + path + ' && rsync')
			.source(files)
			.destination(dest);

		rsync.execute(function(error, code, cmd) {
			if (error) {
				console.error('Rsync error: ' + error.message + ' ' + cmd);
				process.exit(code);
			}
		});
	});
}