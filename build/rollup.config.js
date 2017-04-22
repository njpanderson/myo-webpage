const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const string = require('rollup-plugin-string');
const json = require('rollup-plugin-json');
const sass = require('rollup-plugin-sass');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = {
	format: 'cjs',
	sourceMap: true,
	external: function(id) {
		return /node_modules/.test(id) && !(/popper\.js/.test(id));
	},
	plugins: [
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
		}),
		resolve({
			module: false,
			// extensions: ['.js', '.jsx', '.json'],
			// preferBuiltins: false
		}),
		commonjs(),
		babel({
			exclude: [
				'node_modules/**'
			]
		})
	]
};