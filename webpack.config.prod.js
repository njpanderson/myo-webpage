var config = require('./webpack.config.js');

config.entry = './src/Index.js';

config.output = {
	path: __dirname,
	filename: 'webpack-temp.js'
};

module.exports = config;