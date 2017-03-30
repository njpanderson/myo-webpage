const webpack = require('webpack'),
	ProgressBarPlugin = require('progress-bar-webpack-plugin'),
	WebpackNotifierPlugin = require('webpack-notifier');

var production = (process.env.NODE_ENV === 'production'),
	plugins = [
		new WebpackNotifierPlugin({
			alwaysNotify: true
		}),
		new webpack.DefinePlugin({
			'PRODUCTION': (production),
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new ProgressBarPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity
		})
	];

if (production) {
	plugins = plugins.concat([
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			sourceMap: true
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
	devtool: production ? 'source-map' : 'cheap-module-eval-source-map',
	cache: !production,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	entry: {
		vendor: [
			'react',
			'redux',
			'react-redux',
			'react-dom',
			'interact.js',
			'promise',
			'superagent',
			'superagent-promise'
		],
		main: './src/bootstrap/bootstrap.js',
		view: './src/bootstrap/bootstrap-view.js'
	},
	output: {
		path: 'public_html/dist/js',
		filename: '[name].js',
		publicPath: 'public_html/dist/js/'
	},
	plugins: plugins,
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