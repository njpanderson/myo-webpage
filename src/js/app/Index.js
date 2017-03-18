import { createStore } from 'redux';

import './lib/polyfills';

import UI from './UI.jsx';

import Droplet from './lib/Droplet';
import request from './lib/ajax';
import Template from './lib/Template';

import actions from './state/actions';
import reducers from './state/reducers';

import appDefaults from './assets/defaults';
import { uiStates } from './assets/constants';

/*
 * Main application wraper.
 * @class
 */
var App = function(settings = {}) {
	this.settings = Object.deepAssign({}, App.defaults, settings);
	this._init();
};

App.prototype = {
	_init: function() {
		this._refs = {
			ui: {
				app: document.querySelector('.app')
			},
			mounted: {},
			components: {}
		};

		// app data store (not stateful)
		this._data = {
			template: '',
			pallet: []
		};

		// templates module
		this._template = new Template(this.settings);
	},

	/**
	 * Load the template/pallet data and activate Tag.
	 */
	load: function(url, pallet) {
		return this._template.load(url)
			.then(() => {
				// load the HTML template and create it
				var data = this._template.create();

				this._data.drop_zones = data.drop_zones;
				this._data.template = data.template;
			})
			.then(() => {
				// load the JSON based pallet data
				return this._loadPallet(pallet);
			})
			.then(() => {
				var stored_state = false;

				// create state store
				if (stored_state) {
					// app state store - from session
					// !TODO
				} else {
					// app state store - default
					this._store = createStore(reducers);
				}

				// activate the UI
				this._UI = new UI(
					this.settings,
					this._refs,
					this._data,
					this._store,
					this._template
				);

				// render
				this._UI.render();

				this._store.dispatch(actions.setUIState(uiStates.ACTIVE));
			})
			.catch((error) => {
				throw error;
			});
	},

	/**
	 * Load the pallet data
	 * @private
	 */
	_loadPallet: function(url) {
		return request.get(url)
			.then((response) => {
				var pallet, item;

				try {
					pallet = JSON.parse(response.text);
				} catch(e) {
					return Promise.reject(new Error(
						'Pallet data at file "' + url + '"" could not be parsed.' +
						' is it valid JSON?'
					));
				}

				if (Array.isArray(pallet) && pallet.length) {
					for (item in pallet) {
						this._data.pallet.push(
							new Droplet(pallet[item])
						);
					}
				} else {
					throw new Error(
						'Looks like the pallet at path ' + url +
						' isn’t a valid array in JSON format.'
					);
				}
			})
			.catch((error) => {
				throw error;
			});
	},
};

/**
 * Default settings.
 */
App.defaults = appDefaults;

export default App;