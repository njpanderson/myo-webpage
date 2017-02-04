var $ = window.jQuery,
	Canvas = require('./components/Canvas.jsx'),
	React = require('react'),
	ReactDOM = require('react-dom');

var App = function() {
	this.init();
};

App.prototype = {
	init: function() {
		this.load();

		this._refs.ui = {
			app: document.querySelector('.app')
		};

		this.render();
	},

	load: function(url) {
		$.ajax(url)
			.then(function(response) {
				console.log(response);
			});
	},

	render: function() {
		this._canvas = ReactDOM.render(
			<Canvas/>,
			this._refs.ui.app
		);
	}
};

var app = new App();
app.load('templates/default.html');