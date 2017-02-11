//var $ = window.jQuery;

import './lib/polyfills';
import appDefaults from './assets/defaults';

import Templates from './Templates.js';
import CanvasContainer from './components/CanvasContainer';
import React from 'react';
import { render } from 'react-dom';
import actions from './state/actions';
import reducers from './state/reducers';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

var App = function(settings = {}) {
	this.settings = Object.deepAssign(settings, App.defaults);
	this.init();
};

App.prototype = {
	init: function() {
		this._refs = {
			ui: {
				app: document.querySelector('.app')
			},
			components: {}
		};

		// app data store (not stateful)
		this._data = {};

		// app state store
		this._store = createStore(reducers);

		// templates module
		this._templates = new Templates();

		//this.render();
		this.setInteractions();
	},

	load: function(url, pallet) {
		this._templates.load(url)
			.then(() => {
				// load the HTML template and create it
				this._data.template = this._templates.create();
			})
			.then(() => {
				// load the JSON based pallet data
				return this._loadPallet(pallet);
			})
			.then(() => {
				// activate the app
				this._store.dispatch(actions.activate());

				// render
				this.render();
			})
			.fail(console.error);
	},

	_loadPallet: function(url) {
		return $.ajax(url)
			.then((response) => {
				if (Array.isArray(response) && response.length) {
					this._data.pallet = response;
				} else {
					throw new Error(
						'Looks like the pallet at path ' + url +
						' isn’t a valid array in JSON format.'
					);
				}
			})
			.fail(console.error);
	},

	render: function() {
		this._canvas = render(
			<Provider store={this._store}>
				<CanvasContainer
					data={this._data}
					refCollector={this._refCollector.bind(this)}/>
			</Provider>,
			this._refs.ui.app
		);
	},

	/**
	 * Element reference collector. Collects DOM elements from React components.
	 * Bind an element reference using the ref attribute and collectRef from utils.js
	 * @private
	 */
	_refCollector: function(collection, element, key) {
		if (element !== null) {
			if (typeof key === 'string') {
				if (typeof this._refs.components[collection] === 'undefined') {
					this._refs.components[collection] = {};
				}

				this._refs.components[collection][key] = element;
			} else {
				this._refs.components[collection] = element;
			}
		}
	},

	setInteractions: function() {
	}
};

App.defaults = appDefaults;

module.exports = App;