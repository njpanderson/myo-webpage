const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const string = require('rollup-plugin-string');
const json = require('rollup-plugin-json');
const sass = require('rollup-plugin-sass');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const plugins_base = [
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
			plugins: ['external-helpers', 'transform-object-rest-spread'],
			presets: [
				'react',
				['env', {
					'modules': false,
					'targets': {
						'node': 6
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