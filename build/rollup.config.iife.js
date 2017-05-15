const config = require('./rollup.config'),
	resolve = require('rollup-plugin-node-resolve'),
	commonjs = require('rollup-plugin-commonjs'),
	globals = require('rollup-plugin-node-globals'),
	babel = require('rollup-plugin-babel');

var plugins = config.plugins_base.concat([
	resolve({
		browser: true
	}),
	commonjs(),
	globals(),
	babel({
		babelrc: false,
		plugins: ['external-helpers', 'transform-object-rest-spread'],
		presets: [
			'react',
			['env', {
				'modules': false,
				'targets': {
					'browsers': ['last 2 versions']
				}
			}],
		],
		exclude: [
			'node_modules/**'
		]
	})
]);


module.exports = {
	rollup: {
		external: [
			'react',
			'react-dom'
		]
	},
	write: {
		format: 'iife',
		sourceMap: true,
		globals: {
			'react': 'React',
			'react-dom': 'ReactDOM',
		}
	},
	plugins: plugins
};