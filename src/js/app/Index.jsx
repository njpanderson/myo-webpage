import UI from './UI.js';

import './lib/polyfills';
import Droplet from './lib/Droplet.js';
import request from './lib/ajax';
import Template from './lib/Template.js';

import actions from './state/actions';
import reducers from './state/reducers';

import appDefaults from './assets/defaults';
import { uiStates } from './assets/constants.js';

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
			mounted: {},
			components: {}
		};

		// app data store (not stateful)
		this._data = {
			template: '',
			pallet: []
		};

		// templates module
		this._template = new Template();
	},

	/**
	 * Load the template/pallet data and activate Tag.
	 */
	load: function(url, pallet) {
		this._template.load(url)
			.then(() => {
				// load the HTML template and create it
				this._data.template = this._template.create();
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

				this._store.dispatch(actions.setUIState(uiStates.BUILDING));
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
				var pallet, droplet;

				if (typeof response === 'object') {
					try {
						pallet = JSON.parse(response.text);
					} catch(e) {
						throw new Error(
							'Pallet data at file "' + url + '"" could not be parsed.' +
							' is it valid JSON?'
						);
					}

					for (droplet in pallet) {
						this._data.pallet.push(
							new Droplet(pallet[droplet])
						);
					}
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

export default App;