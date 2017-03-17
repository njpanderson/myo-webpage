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
	devtool: production ? 'source-map' : 'inline-source-map',
	cache: !production,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	entry: {
		main: './src/js/bootstrap.js',
		view: './src/js/bootstrap-view.js'
	},
	output: {
		filename: 'tag-[name].min.js',
		publicPath: 'dist/js/'
	},
	plugins: plugins,
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}, {
			test: /\.svg$/,
			loader: 'svg-sprite?' + JSON.stringify({
				name: 'icon-[1]',
				prefixize: true,
				regExp: './img/svg/(.*)\\.svg'
			})
		}]
	}
};

module.exports = config;