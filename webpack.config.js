const webpack = require('webpack'),
	ProgressBarPlugin = require('progress-bar-webpack-plugin'),
	WebpackNotifierPlugin = require('webpack-notifier');

var config = {
	devtool: 'source-map',
	cache: false,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	entry: {
		main: './src/bootstrap/bootstrap.js',
		view: './src/bootstrap/bootstrap-view.js'
	},
	output: {
		path: 'public_html/dist/js',
		filename: '[name].js',
		publicPath: 'public_html/dist/js/'
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: true
		}),
		new WebpackNotifierPlugin({
			alwaysNotify: true
		}),
		new ProgressBarPlugin()
	],
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}, {
			test: /\.svg$/,
			loader: 'svg-sprite-loader?' + JSON.stringify({
				name: 'icon-[1]',
				prefixize: true,
				regExp: './img/svg/(.*)\\.svg'
			})
		},{
			test: /\.scss$/,
			use: [{
				loader: 'style-loader' // creates style nodes from JS strings
			}, {
				loader: 'css-loader' // translates CSS into CommonJS
			}, {
				loader: 'sass-loader' // compiles Sass to CSS
			}]
		}]
	}
};

module.exports = config;