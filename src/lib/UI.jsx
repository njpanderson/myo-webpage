import DragDrop from './DragDrop.js';
import Communicator from './Communicator';

import CanvasContainer from '../components/containers/CanvasContainer';

import actions from '../state/actions';

import { dialogModes, uiStates, messageCommands } from '../assets/constants';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

var UI = function(parent, settings, refs, data, store, template) {
	/**
	 * Settings as defined when instantiating. Inherits from {@link App.defaults}
	 */
	this._parent = parent;
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
		},
		vp_width: 0,
		dragHandlePosition: 0
	};

	this._comms = new Communicator('app', window.location.origin, {
		message: (message) => {
			console.log('message to "app"!', message);
		}
	});

	// general queues
	this.queues = {
		dragdropBindings: []
	};

	window.addEventListener('resize', this._handleWindowResize.bind(this));
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
					refCollector={this._refCollector.bind(this)}
					onMount={this._mountEvent.bind(this)}
					onDialogComplete={this._completeDialogAction.bind(this)}
					onDialogCancel={this._cancelDialogAction.bind(this)}
					onAttachmentClick={this._handleAttachmentClick.bind(this)}
					onDropletClick={this._handleDropletClick.bind(this)}
					onDropZoneClick={this._handleDropZoneClick.bind(this)}
					onDragHandlePress={this._handleDragHandleEvent.bind(this)}
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
		this._store.dispatch(actions.setDialogMode(mode, data));
	},

	_completeDialogAction: function(dialog_data) {
		var state = this._store.getState();

		// reset dialog state to nothing
		this._store.dispatch(actions.setDialogMode(dialogModes.NONE));

		switch (state.dialog.mode) {
		case dialogModes.EDIT_DROPLET:
			// droplet being edited prior to or during attatchment
			if (state.dialog.state.attachment_index === null) {
				// no attachment index - this is a new drop
				this.zoneAddAttachment(
					state.dialog.state.zone_id,
					state.dialog.state.droplet_id,
					dialog_data
				);
			} else{
				this.zoneEditAttachment(
					state.dialog.state.zone_id,
					state.dialog.state.attachment_index,
					dialog_data
				);
			}
		}
	},

	_cancelDialogAction: function() {
		// noop
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

	/**
	 * Captures mount events from React components by collection/key identifiers.
	 * Identifiers are the same as the ones stored with App#_refCollector
	 * @private
	 */
	_mountEvent: function(collection, key) {
		if (this._getReferencedElement(collection, key)) {
			// valid component mounted
			switch (collection) {
			case 'canvas':
				// add drag binding for the drag handle
				this._queueDragDropBinding('drag', 'drag_handle', null, {
					onDragMove: this._handleDragHandleEvent.bind(this)
				});

				// process all drag/drop bindings
				this._setDragDropBindings();
				this._refs.mounted.canvas = true;
				break;

			case 'template':
				// this._queueDragDropBinding('drop', collection, key);
				this._refs.mounted.template = true;
				break;

			case 'droplet':
				this._queueDragDropBinding('drag', collection, key);
				break;

			case 'dropzone':
				this._queueDragDropBinding('drop', 'dropzone_target', key);
				break;

			case 'view_frame':
				this._comms.registerGuestAddress(
					'view',
					this._refs.components[collection].contentWindow
				);

				this._refs.mounted.view_frame = true;
			}

			if (
				this._refs.mounted.canvas &&
				this._refs.mounted.template &&
				this._refs.mounted.view_frame
				) {
				// all required refs mounted - set active
				this._store.dispatch(actions.setUIState(uiStates.ACTIVE));

				// run initial size calculations
				this._handleWindowResize();
			}
		} else {
			throw new Error(
				'Component mount event called but ref was not collected. ' +
				'component: ' + collection + (key ? '/' + key : '')
			);
		}
	},

	/**
	 * Queues a drag/drop DOM binding till the mount event for the Canvas component.
	 * This is done because the canvas is relied upon as the container for dragging.
	 * @private
	 */
	_queueDragDropBinding: function(type, collection, key, settings) {
		if (this._refs.components.canvas) {
			// canvas already exists - immediately bind
			this._setDragDropBindings([{ type, collection, key, settings }]);
		} else {
			// push to queue
			this.queues.dragdropBindings.push({ type, collection, key, settings });
		}
	},

	_setDragDropBindings: function(queue = this.queues.dragdropBindings) {
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
				data;

			if (item.collection === 'dropzone_target') {
				data = {
					zone_id: item.key
				};
			}

			// create a DragDrop instance and assign to the pallet item data
			if (item.type === 'drag') {
				this._data.UI.dragdrop.droplets.addDragable(ref, item.settings, data);
			} else if (item.type === 'drop') {
				this._data.UI.dragdrop.droplets.addDropable(ref, Object.deepAssign({}, {
					accept: this.settings.selectors.droplet
				}, item.settings), data);
			}
		});
	},

	/**
	 * Handles drops of droplets into drop zones. Will attach to the zone
	 * if the drop is valid.
	 * @param {HTMLElement} element - The element being dragged.
	 * @param {HTMLElement} target - The target being dropped onto.
	 * @param {object} data - data object, as set with addDragable/addDropable.
	 * @private
	 */
	_handleDropletDrop: function(element, target, data) {
		var drop_zone = this.getDropZoneById(data.zone_id),
			droplet = this.getDropletById(element.id);

		return this.attachDropletToDropZone(droplet, drop_zone);
	},

	_handleAttachmentClick: function(droplet, drop_zone, attachment_index) {
		this._showDialog(dialogModes.EDIT_DROPLET, {
			droplet_id: droplet.id,
			zone_id: drop_zone.id,
			attachment_index
		});
	},

	_handleDropletClick: function(event, droplet) {
		var state = this._store.getState();

		if (state.app.active_droplet_id !== droplet.id) {
			this._store.dispatch(actions.setActiveDroplet(droplet.id));
		}
	},

	_handleDropZoneClick: function(event, drop_zone) {
		var state = this._store.getState(),
			droplet;

		if (state.app.active_droplet_id !== 0 &&
			(droplet = this.getDropletById(state.app.active_droplet_id))) {
			this.attachDropletToDropZone(droplet, drop_zone);
		}
	},

	/**
	 * Handles events from the drag handle (between template and view containers)
	 * @private
	 */
	_handleDragHandleEvent: function(event) {
		var width;

		switch (event.type) {
		case 'dragmove':
			// incrememt dragHandlePosition based on x delta from interact instance
			this._data.UI.dragHandlePosition += event.dx;

			// figure out handle position in % of the screen and convert it to percent,
			// then send straight to _setTemplateViewRatio function
			this._setTemplateViewRatio(
				((this._data.UI.drag_handle_x + this._data.UI.dragHandlePosition) /
					this._data.UI.vp_width) * 100
			);

			break;

		case 'mouseup':
		case 'touchend':
			if (this._data.UI.dragHandlePosition < 5 && this._data.UI.dragHandlePosition > -5) {
				// little movement - assume a click/tap occured
				width = (this._getReferencedElement('drag_handle')).offsetWidth;

				if (this._data.UI.drag_handle_x < width) {
					// set to 50/50
					this._setTemplateViewRatio(50);
				} else {
					// set to 0/100
					this._setTemplateViewRatio(0);
				}
			}

			// update metrics whenever we're stopping
			this._handleWindowResize();
			break;
		}
	},

	_handleWindowResize: function() {
		this._data.UI.drag_handle_x = (this._getReferencedElement('drag_handle')).offsetLeft;
		this._data.UI.vp_width =
			Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		// reset dragHandlePosition because the metrics have changed
		this._data.UI.dragHandlePosition = 0;
	},

	/**
	 * @param {number} ratio - % ratio for the template
	 * @description
	 * Sets the template/view ratio by giving the template container a % width and
	 * adjusting the view container accordingly.
	 * @private
	 */
	_setTemplateViewRatio: function(ratio) {
		this._refs.components.template.style.flexBasis = ratio + '%';
		this._refs.components.view.style.flexBasis = Math.abs(ratio - 100) + '%';
	},

	_isValidDrop: function(droplet, drop_zone) {
		return drop_zone.willAccept(droplet, this._store);
	},

	attachDropletToDropZone: function(droplet, drop_zone) {
		// clear active droplet
		this._store.dispatch(actions.setActiveDroplet(''));

		// check if valid drop
		if (this._isValidDrop(droplet, drop_zone)) {
			if (droplet.editable) {
				// show edit dialog before adding the attachment
				this._showDialog(dialogModes.EDIT_DROPLET, {
					droplet_id: droplet.id,
					zone_id: drop_zone.id,
					attachment_index: null
				});
			} else {
				// add attachment without dialog
				this.zoneAddAttachment(
					drop_zone.id,
					droplet.id,
					droplet.data
				);
			}

			return true;
		} else {
			return false;
		}
	},

	zoneAddAttachment: function(zone_id, droplet_id, data) {
		this._store.dispatch(actions.zoneAddAttachment(
			zone_id,
			droplet_id,
			true,
			data
		));

		this._updateView();
	},

	zoneEditAttachment: function(zone_id, attachment_index, data) {
		this._store.dispatch(actions.zoneEditAttachment(
			zone_id,
			attachment_index,
			data
		));

		this._updateView();
	},

	zoneDetachAttachment: function(zone_id, attachment_index) {
		this._store.dispatch(actions.zoneDetachAttachment(
			zone_id,
			attachment_index
		));
	},

	/**
	 * Retrieve a zone's attachment (by index)
	 */
	zoneGetAttachment: function(zone_id, attachment_index) {
		var zone,
			state = this._store.getState();

		if (state.zones &&
			(zone = state.zones[zone_id]) &&
			zone.attachments &&
			zone.attachments.length > attachment_index
		) {
			return zone.attachments[attachment_index];
		}

		return null;
	},

	_updateView: function() {
		var state = this._store.getState();

		this._comms.send('view', {
			cmd: messageCommands.RELOAD,
			data: {
				markup: this._template.renderAsHTML(
					state.zones
				)
			}
		});
	},

	/**
	 * Obtains an element stored in the internal refs collection
	 */
	_getReferencedElement: function(collection, key) {
		var ref;

		if (
			((typeof key === 'undefined' || !key) && (ref = this._refs.components[collection])) ||
			(ref = this._refs.components[collection][key])
		) {
			return ref;
		} else {
			throw new Error('Referenced element at ' + collection + '(' + key +
				') could not be found.');
		}
	},

	getDropletById: function(id) {
		return this._data.pallet.find((element) => {
			return element.id === id;
		});
	},

	getDropZoneById: function(id) {
		return this._data.drop_zones[id] || null;
	}
};

export default UI;