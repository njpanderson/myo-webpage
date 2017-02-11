const webpack = require('webpack');

var production = (process.env.NODE_ENV === 'production'),
	plugins = [];

if (production) {
	plugins = plugins.concat([
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			compress: {
				warnings: false
			}
		}),
	]);
} else {
	plugins = plugins.concat([
		new webpack.LoaderOptionsPlugin({
			debug: true
		})
	]);
}

var config = {
	devtool: production ? 'source-map' : 'eval-source-map',
	cache: !production,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		filename: 'tag.min.js',
		publicPath: 'dist/js/'
	},
	plugins: plugins,
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	}
};

module.exports = config;