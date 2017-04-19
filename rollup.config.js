import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
	entry: 'src/Index.js',
	format: 'cjs',
	dest: 'dist/tag-cjs.js',
	plugins: [
		resolve(),
		json(),
		commonjs({
			namedExports: {
				// left-hand side can be an absolute path, a path
				// relative to the current directory, or the name
				// of a module in node_modules
				'node_modules/react-dom/index.js': ['render'],
				'node_modules/react/react.js': ['Children', 'Component', 'createElement']
			}
		}),
		babel({
			exclude: [
				'node_modules/**'
			]
		})
	]
};