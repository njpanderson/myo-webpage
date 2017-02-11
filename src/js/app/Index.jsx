import './lib/polyfills';
import appDefaults from './assets/defaults';

import Templates from './lib/Templates.js';
import UI from './UI.js';
import actions from './state/actions';
import reducers from './state/reducers';
import request from './lib/ajax';

import { createStore } from 'redux';

/*
 * Main application wraper.
 * @class
 */
var App = function(settings = {}) {
	this.settings = Object.deepAssign(settings, App.defaults);
	this._init();
};

App.prototype = {
	_init: function() {
		this._refs = {
			ui: {
				app: document.querySelector('.app')
			},
			components: {}
		};

		// app data store (not stateful)
		this._data = {
			template: '',
			pallet: []
		};

		// templates module
		this._templates = new Templates();
	},

	/**
	 * Load the template/pallet data and activate Tag.
	 */
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
				var droplet, stored_state = false;

				// create state store
				if (stored_state) {
					// app state store - from session
					// !TODO
				} else {
					// app state store - default
					this._store = createStore(reducers);

					// add pallet items to state
					for (droplet in this._data.pallet) {
						this._store.dispatch(actions.palletAdd(droplet));
					}
				}

				// activate the app
				this._store.dispatch(actions.activate());
				this._UI = new UI(this.settings, this._refs, this._data, this._store);

				// render
				this._UI.render();
			})
			.catch(console.error);
	},

	/**
	 * Load the pallet data
	 * @private
	 */
	_loadPallet: function(url) {
		return request.get(url)
			.then((response) => {
				if (typeof response === 'object') {
					this._data.pallet = JSON.parse(response.text);
				} else {
					throw new Error(
						'Looks like the pallet at path ' + url +
						' isn’t a valid array in JSON format.'
					);
				}
			})
			.catch(console.error);
	},
};

/**
 * Default settings.
 */
App.defaults = appDefaults;

module.exports = App;