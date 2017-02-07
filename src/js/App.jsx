var $ = window.jQuery;

import './assets/polyfills';
import appDefaults from './assets/defaults';

import Templates from './Templates.js';
import Canvas from './components/Canvas.jsx';
import React from 'react';
import { render } from 'react-dom';
import actions from './state/actions';
// import interact from 'interact-js';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

var App = function(settings = {}) {
	this.settings = Object.deepAssign(settings, App.defaults);
	console.log(this.settings);
	this.init();
};

App.prototype = {
	init: function() {
		this._refs = {
			ui: {
				app: document.querySelector('.app')
			}
		};

		this._store = createStore(require('./state/reducers'));
		this._templates = new Templates();

		// !TODO remove sample code
		this._store.dispatch(actions.palletAdd({
			id: 'h1',
			name: 'Header',
			value: 'My Heading',
			dropletType: 'text',
			attachmentId: 'header-1'
		}));

		this.render();
	},

	load: function(url = this.settings.url) {
		this._templates.load(url)
			.then(() => {
				this._store.dispatch(actions.templateSet(
					this._templates.create()
				));
			});
	},

	render: function() {
		this._canvas = render(
			<Provider store={this._store}>
				<Canvas/>
			</Provider>,
			this._refs.ui.app
		);
	}
};

App.defaults = appDefaults;

var app = new App();
app.load('templates/default.html');