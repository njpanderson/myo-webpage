var config = require('./webpack.config.js');

const webpack = require('webpack');

config.entry = './src/js/app/Index.jsx';

config.plugins = (config.plugins || []).concat([
	new webpack.LoaderOptionsPlugin({
		debug: true
	})
]);


config.output = {
	path: __dirname,
	filename: 'webpack-temp.js'
};

module.exports = config;