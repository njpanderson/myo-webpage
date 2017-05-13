const config = require('./rollup.config');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const globals = require('rollup-plugin-node-globals');
const babel = require('rollup-plugin-babel');

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
	plugins: config.plugins_base.concat([
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
	])
};