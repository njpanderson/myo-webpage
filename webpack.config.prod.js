var config = require('./webpack.config.js');

config.entry = './src/js/App.jsx';

config.debug = true;

config.output = {
	path: __dirname,
	filename: 'webpack-temp.js'
};

module.exports = config;