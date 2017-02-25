import DragDrop from './lib/DragDrop.js';
import Communicator from './lib/Communicator';
import Droplet from './lib/Droplet';

import CanvasContainer from './components/CanvasContainer';

import actions from './state/actions';

import { dialogModes, uiStates, messageCommands, errorCodes } from './assets/constants.js';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

var UI = function(settings, refs, data, store, template) {
	/**
	 * Settings as defined when instantiating. Inherits from {@link App.defaults}
	 */
	this.settings = settings;
	this._refs = refs;
	this._data = data;
	this._store = store;
	this._template = template;

	// UI class specific data entries
	this._data.UI = {
		dragdrop: {},
		dropletEdit: {
			droplet: null,
			callback: null
		}
	};

	this._comms = new Communicator('app', window.location.origin, {
		message: (message) => {
			console.log('message to "app"!', message);
		}
	});

	// other stuff
	this._dragDropBindingsQueue = [];
};

UI.prototype = {
	/**
	 * Sends render() call to the React canvas.
	 * @private
	 */
	render: function() {
		this._canvas = render(
			<Provider store={this._store}>
				<CanvasContainer
					data={this._data}
					settings={this.settings}
					view={this.settings.view}
					classes={this.settings.classes}
					refCollector={this._refCollector.bind(this)}
					onMount={this._mountEvent.bind(this)}
					onDialogComplete={this._completeDialogAction.bind(this)}
					onDropletEdit={this._completeDropletEdit}
					class_ui={this}
					class_template={this._template}/>
			</Provider>,
			this._refs.ui.app
		);
	},

	/**
	 * Displays an editor window for a Droplet.
	 * @param {string} mode - One of the dropletModes modes.
	 * @param {mixed} data - Relevant data to store for the dialog to use.
	 * @private
	 */
	_showDialog: function(mode, data) {
		this._store.dispatch(actions.setUIState(uiStates.IN_DIALOG));
		this._store.dispatch(actions.setDialogMode(mode, data));
	},

	_completeDialogAction: function(dialog_data) {
		var state = this._store.getState(),
			dialogMode = state.dialogMode;
		console.log('_completeDropletEdit', state.dialogMode);
		// reset dialog to nothing change, ui to building
		this._store.dispatch(actions.setUIState(uiStates.BUILDING));
		this._store.dispatch(actions.setDialogMode(dialogModes.NONE));

		switch (dialogMode.mode) {
		case dialogModes.EDIT_DROPLET:
			// droplet being edited prior to or during attatchment
			if (!dialogMode.state.attachment_index) {
				// no attachment index - this is a new drop
				this._store.dispatch(actions.zoneAddAttachment(
					dialogMode.state.zone_id,
					dialogMode.state.droplet_id,
					true,
					dialog_data
				));
			}
		}
	},

	/**
	 * Element reference collector. Collects DOM elements from React components.
	 * Bind an element reference using the ref attribute and collectRef from utils.js
	 * @private
	 */
	_refCollector: function(collection, element, key) {
		// console.log('_refCollector', 'collection:' + collection, 'element:', element, 'key:' + key);
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

	/**
	 * Captures mount events from React components by collection/key identifiers.
	 * Identifiers are the same as the ones stored with App#_refCollector
	 * @private
	 */
	_mountEvent: function(collection, key) {
		// console.log('_mountEvent', collection, key);
		if (this._getReferencedElement(collection, key)) {
			// valid component mounted
			// console.log('mounted', this._refs.components[collection][key]);
			switch (collection) {
			case 'canvas':
				this._setDragDropBindings();
				this._refs.mounted.canvas = true;
				break;

			case 'template':
				// this._setDropZones(ref);
				this._queueDragDropBinding('drop', collection, key);
				this._refs.mounted.template = true;
				break;

			case 'droplet':
				this._queueDragDropBinding('drag', collection, key);
				break;

			case 'view_frame':
				this._comms.registerGuestAddress('view', this._refs.components[collection].contentWindow);
				this._refs.mounted.view_frame = true;
			}

			if (
				this._refs.mounted.canvas &&
				this._refs.mounted.template &&
				this._refs.mounted.view_frame
				) {
				this._store.dispatch(actions.activate());
				console.log('all mounted');
			}
		} else {
			throw new Error(
				'Component mount event called but ref was not collected. ' +
				'component: ' + collection + (key ? '/' + key : '')
			);
		}
	},

	_queueDragDropBinding: function(type, collection, key) {
		if (this._refs.components.canvas) {
			// canvas already exists - immediately bind
			// console.log('_queueDragDropBinding - binding now');
			this._setDragDropBindings([{ type, collection, key }]);
		} else {
			// push to queue
			// console.log('_queueDragDropBinding - queueing up');
			this._dragDropBindingsQueue.push({ type, collection, key });
		}
	},

	_setDragDropBindings: function(queue = this._dragDropBindingsQueue) {
		// bind dragDrop handlers to the elements in the queue
		this._data.UI.dragdrop.droplets = new DragDrop(
			this._refs.components.canvas,
			this.settings, {
				drop: this._handleDropletDrop.bind(this),
				dragEnd: (element) => {
					this._data.UI.dragdrop.droplets.resetDragPosition(element);
				}
			}
		);

		queue.forEach((item) => {
			var ref = this._getReferencedElement(item.collection, item.key),
				drop_zones;

			// console.log('binding item', this._data.pallet[item.key], ref);
			// create a DragDrop instance and assign to the pallet item data
			if (item.type === 'drag') {
				this._data.UI.dragdrop.droplets.addDragable(ref);
			} else if (item.type === 'drop') {
				drop_zones = ref.querySelectorAll(this.settings.selectors.drop_zone);

				drop_zones.forEach((zone) => {
					this._data.UI.dragdrop.droplets.addDropable(zone, {
						accept: this.settings.selectors.droplet
					});
				});
			}
		});
	},

	_handleDropletDrop: function(element, zone) {
		var drop_zone = this._template.getDropZoneById(zone.dataset.id),
			droplet = this.getDropletById(element.id);

		if (this._isValidDrop(droplet, drop_zone)) {
			this._showDialog(dialogModes.EDIT_DROPLET, {
				droplet_id: droplet.id,
				zone_id: zone.id,
				attachment_index: null
			});
		}
	},

	_isValidDrop: function(droplet, drop_zone) {
		return drop_zone.willAccept(droplet, this._store);
	},

	_updateView: function() {
		// !TODO
		this._comms.send('view', {
			cmd: messageCommands.RELOAD
		});
	},

	/**
	 * Obtains an element stored in the internal refs collection
	 */
	_getReferencedElement: function(collection, key) {
		var ref;

		if (
			(typeof key === 'undefined' && (ref = this._refs.components[collection])) ||
			(ref = this._refs.components[collection][key])
		) {
			return ref;
		}

		return false;
	},

	getDropletById: function(id) {
		return this._data.pallet.find((element) => {
			return element.id === id;
		});
	}
};

export default UI;