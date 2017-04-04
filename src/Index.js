/**
 * The built in HTMLElement type. Used to define DOM compatible nodes of Element type.
 * @typedef HTMLElement
 */
import { createStore } from 'redux';

import './lib/polyfills';
import './styles/main.scss';

import UI from './lib/UI.jsx';
import { GLYPHS } from './components/views/Icon.jsx';

import Droplet from './lib/Droplet';
import request from './lib/ajax';
import Template from './lib/Template';

import actions from './state/actions';
import reducers from './state/reducers';

import appDefaults from './assets/defaults';
import dialogs from './assets/dialogs';
import { dialogModes, uiStates, actionTypes, messageCommands } from './assets/constants';

/*
 * Main application wraper.
 * @class
 */
var App = function(settings = {}) {
	this.settings = Object.deepAssign({}, App.defaults, settings);
	this._init();

	// set Template.onElementRender to settings, if defined
	if (settings.onElementRender) {
		Template.onElementRender = settings.onElementRender.bind(this);
	}

	// bind hideDialog to this context in case its used as a direct argument within a promise
	this.hideDialog = this.hideDialog.bind(this);
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
			pallet: [],
			tempCallbacks: {}
		};

		// templates module
		this._template = new Template(this, this.settings);
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
					this._store = createStore(
						reducers,
						undefined,
						(
							typeof window !== 'undefined' &&
							window.__REDUX_DEVTOOLS_EXTENSION__ &&
							window.__REDUX_DEVTOOLS_EXTENSION__({
								// black list all session-based non persistant actions
								// (some of which contain unserialisable objects)
								actionsBlacklist: [
									actionTypes.SET_ACTIVE_DROPLET,
									actionTypes.SET_DIALOG_MODE
								]
							})
						)
					);
				}

				// activate the UI
				this._UI = new UI(
					this,
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

	/**
	 * Displays a dialog message with optional confirmations
	 * @param {string} title - Title of the dialog.
	 * @param {array|HTMLElement} message - Message to display.
	 * @param {array} [buttons] - Buttons to show. Defaults to a single "OK" button.
	 * @returns {Promise} a Promise, the resolve/reject methods of which will denote
	 * completion or cancellation of the dialog. Custom button events will not complete
	 * the promise.
	 */
	dialog: function(title, message, buttons = []) {
		this.requireUI();

		if (!Array.isArray(message)) {
			message = [message];
		}

		return this._UI._showDialog(
			dialogModes.GENERAL, {
				title,
				message,
				buttons
			}
		);
	},

	hideDialog: function() {
		this._UI._hideDialog.apply(this._UI);
	},

	startTour: function() {
		this.requireUI();
		this._UI._tour.start();
	},

	reset: function() {
		this.requireUI();

		this._UI._showDialog(dialogModes.GENERAL, dialogs.resetState)
			.then(() => {
				// clear all zones
				this._store.dispatch(actions.zoneClearAllAttachments());

				// clear view
				this._UI._comms.send('view', {
					cmd: messageCommands.RESET
				});

				this.hideDialog();
			})
			.catch(function(error) {
				error && console.error(error);
				this.hideDialog();
			}.bind(this));
	},

	updateView: function() {
		this.requireUI();
		this._UI._updateView();
	},

	requireUI: function() {
		if (!this._UI) {
			throw new Error('UI has not yet been initialised! Have you used #load() yet?');
		}
	}
};

/**
 * Default settings.
 */
App.defaults = appDefaults;

/**
 * Icon glyphs
 */
App.GLYPHS = GLYPHS;

export default App;