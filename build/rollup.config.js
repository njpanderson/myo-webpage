const replace = require('rollup-plugin-replace'),
	resolve = require('rollup-plugin-node-resolve'),
	commonjs = require('rollup-plugin-commonjs'),
	babel = require('rollup-plugin-babel'),
	string = require('rollup-plugin-string'),
	json = require('rollup-plugin-json'),
	sass = require('rollup-plugin-sass'),
	postcss = require('postcss'),
	cssnano = require('cssnano'),
	autoprefixer = require('autoprefixer');

const plugins_base = [
	replace({
		ENVIRONMENT: JSON.stringify(process.env.NODE_ENV),
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}),
	json({
		exclude: 'node_modules'
	}),
	string({
		include: '**/*.svg'
	}),
	sass({
		insert: true,
		processor: css => postcss([
			autoprefixer,
			cssnano
		])
			.process(css)
			.then(result => result.css),
		options: {
			sourceMap: true,
			sourceMapContents: true,
			sourceMapEmbed: true
		}
	})
];

module.exports = {
	rollup: {
		external: function(id) {
			return (
				!(/^(\.|\/|src)/.test(id)) && // include local includes
				!(/popper\.js/.test(id)) && // include popper.js
				!(/(babel|commonjs)Helpers/.test(id)) // include helpers
			);
		}
	},
	write: {
		format: 'cjs',
		sourceMap: true,
	},
	plugins: plugins_base.concat([
		resolve({
			// preferBuiltins: false
		}),
		commonjs(),
		babel({
			babelrc: false,
			plugins: [
				'external-helpers',
				'transform-object-rest-spread',
				'transform-es2015-shorthand-properties'
			],
			presets: [
				'react',
				['env', {
					'modules': false,
					'targets': {
						'node': 4
					}
				}],
			],
			exclude: [
				'node_modules/**'
			]
		})
	]),
	plugins_base: plugins_base
};