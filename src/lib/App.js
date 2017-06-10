/**
 * The built in HTMLElement type. Used to define DOM compatible nodes of Element type.
 * @typedef HTMLElement
 */

/**
 * React's internal simulated event type. Exposes further properties for ease of development.
 * @typedef ReactEvent
 */

/**
 * @callback DialogPromise
 * @param {DialogData} dialog - Data from the dialog.
 */

/**
 * @typedef DialogData
 * @property {object} data - Data from any form elements within the dialog.
 * @property {string} action - Action string. 'submit', 'cancel' or a custom action, if set.
 * @property {object} action_data - Data specific to the special action, if set.
 */

import { createStore } from 'redux';

import './polyfills';
import '../styles/main.scss';

import UI from './UI.jsx';
import { GLYPHS } from '../components/views/Icon.jsx';

import Droplet from './Droplet';
import request from './ajax';
import Template from './Template';
import Storage from './Storage';
import { structCompare } from './utils';

import actions from '../state/actions';
import reducers from '../state/reducers';

import appDefaults from '../assets/defaults';
import defaultState from '../assets/default-state';
import createDialogs from '../assets/dialogs';
import { dialogModes, uiStates, actionTypes, messageCommands } from '../assets/constants';
import { attachSVG } from '../img/svg-sprite';

/**
 * Main application wrapper.
 * @param {AppDefaults} settings - Settings object.
 * @class
 */
var App = function(settings = {}) {
	this.settings = Object.deepAssign({}, App.defaults, settings);
	this._init();
	this.dialogs = createDialogs(this.settings);
	this.storage = new Storage('tag_app');

	// attach the SVG sprite to the document
	attachSVG();

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
				app: document.querySelector(this.settings.selectors.app)
			},
			mounted: {},
			components: {}
		};

		// app data store (not stateful)
		this._data = {
			template: '',
			palette: []
		};

		// templates module
		this._template = new Template(this, this.settings);
	},

	/**
	 * Load the template/palette data and activate tag.
	 */
	load: function(url, palette) {
		return this._template.load(url)
			.then(() => {
				// load the HTML template and create it
				var data = this._template.create();

				this._data.drop_zones = data.drop_zones;
				this._data.template = data.template;
			})
			.then(() => {
				// load the JSON based palette data
				return this._loadPalette(palette);
			})
			.then(() => {
				var stored_state = this.storage.get('state', undefined);

				if (stored_state !== undefined &&
					typeof stored_state === 'object') {
					// stored state exists - reset UI (which is non-persistant)
					stored_state.UI = {};
					stored_state.UI = defaultState.UI;

					if (!this._validate_state(stored_state)) {
						// reset stored_state back to undefined if  it's not valid
						stored_state = undefined;
					}
				} else {
					// reset back to undefined
					stored_state = undefined;
				}

				// app state store - default
				this._store = createStore(
					reducers,
					stored_state,
					(
						typeof window !== 'undefined' &&
						window.__REDUX_DEVTOOLS_EXTENSION__ &&
						window.__REDUX_DEVTOOLS_EXTENSION__({
							// black list all session-based non persistant actions
							// (some of which contain unserialisable objects)
							actionsBlacklist: [
								actionTypes.SET_ACTIVE_DROPLET,
								actionTypes.SET_DIALOG_MODE,
								actionTypes.SET_TOUR_STAGE,
								actionTypes.SHOW_TOOLTIP,
								actionTypes.HIDE_TOOLTIP,
								actionTypes.SET_TOOLTIP_CONTENT
							]
						})
					)
				);

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

				// set active state
				this._store.dispatch(actions.setUIState(uiStates.ACTIVE));
			})
			.catch((error) => {
				throw error;
			});
	},

	/**
	 * Load the palette data
	 * @private
	 */
	_loadPalette: function(src) {
		if (typeof src === 'string') {
			// load palette as a url
			return this._loadPaletteFromFile(src);
		} else if (typeof src === 'object') {
			// load palette directly
			this._loadPaletteFromArray(src);
			return Promise.resolve();
		}
	},

	_loadPaletteFromFile: function(url) {
		return request.get(url)
			.then((response) => {
				var palette;

				try {
					palette = JSON.parse(response.text);
				} catch(e) {
					return Promise.reject(new Error(
						'Palette data at file "' + url + '"" could not be parsed.' +
						' is it valid JSON?'
					));
				}

				if (Array.isArray(palette) && palette.length) {
					this._loadPaletteFromArray(palette);
				} else {
					throw new Error(
						'Looks like the palette at path ' + url +
						' isn’t a valid array in JSON format.'
					);
				}
			})
			.catch((error) => {
				throw error;
			});
	},

	_loadPaletteFromArray: function(palette) {
		var item;

		for (item in palette) {
			this._data.palette.push(
				new Droplet(palette[item])
			);
		}
	},

	/**
	 * Validates a state object by comparing it to the default state.
	 * @private
	 */
	_validate_state: function(state) {
		return structCompare(state, defaultState);
	},

	/**
	 * Displays a dialog message with optional confirmations
	 * @param {string} title - Title of the dialog.
	 * @param {array|HTMLElement} message - Message to display.
	 * @param {array} [buttons] - Buttons to show. Defaults to a single "OK" button.
	 * @returns {DialogPromise} a Promise, the resolve/reject methods of which will denote
	 * completion or cancellation of the dialog. Custom button events will not complete
	 * the promise.
	 */
	dialog: function(title, message, buttons = []) {
		this._requireUI();

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

	/**
	 * Hides whichever active dialog is currently open.
	 */
	hideDialog: function() {
		this._UI._hideDialog.apply(this._UI);
	},

	/**
	 * Starts the standardised tour process, guiding the user through the interface.
	 */
	startTour: function() {
		this._requireUI();
		this._UI._tour.start();
	},

	/**
	 * Resets the template and view frame. *note*, all placements will be lost.
	 */
	reset: function() {
		this._requireUI();

		this._UI._showDialog(dialogModes.GENERAL, this.dialogs.resetState)
			.then((dialog) => {
				if (dialog.action !== 'cancel') {
					// clear all zones and reset the app
					this._store.dispatch(actions.zoneClearAllAttachments());
					this._store.dispatch(actions.resetApp());

					// clear view
					this._UI._comms.send('view', {
						cmd: messageCommands.RESET
					});
				}

				this.hideDialog();
			});
	},

	/**
	 * Updates the view frame with the latest template and its attachments.
	 */
	updateView: function() {
		this._requireUI();
		this._UI._updateView();
	},

	/**
	 * Requires a _UI instance. Will throw if one doesn't exist.
	 */
	_requireUI: function() {
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