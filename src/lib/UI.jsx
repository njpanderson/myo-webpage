import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Popper from 'popper.js';

import DragDrop from './DragDrop';
import Communicator from './Communicator';
import Tour from './Tour';

import CanvasContainer from '../components/containers/CanvasContainer';

import actions from '../state/actions';

import { dialogModes, uiStates, messageCommands } from '../assets/constants';

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
		dragdrop: {
			// droplets dragdrop class instance
			droplets: {}
		},

		// the current viewport width
		vp_width: 0,

		// the drag handle position
		dragHandlePosition: 0,
	};

	this._comms = new Communicator('app', window.location.origin, {
		message: (message) => {
			console.log('message to "app"!', message);
		}
	});

	this._tour = new Tour(this);

	// set up library methods for passing to React components
	this.libraryMethods = {
		getDropletById: this.getDropletById.bind(this),
		setUIPopperAttachment: this._setUIPopperAttachment.bind(this),
		zoneDetachAttachment: this.zoneDetachAttachment.bind(this),
		zoneGetAttachment: this.zoneGetAttachment.bind(this),
		isValidDrop: this._isValidDrop.bind(this),
		tools: {
			dialog: this._parent.dialog.bind(this._parent),
			hideDialog: this._hideDialog.bind(this),
			startTour: this._tour.start.bind(this._tour),
			reset: this._parent.reset.bind(this._parent),
			updateView: this._updateView.bind(this)
		}
	};

	// perform bindings for methods commonly used within promises
	this._hideDialog = this._hideDialog.bind(this);
	this._showDialog = this._showDialog.bind(this);

	// show introduction (or not)
	if (this.settings.showIntro) {
		this._tour.intro();
	}

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
					onAttachmentClick={this._handleAttachmentClick.bind(this)}
					onDropletEvent={this._handleDropletEvent.bind(this)}
					onDropZoneEvent={this._handleDropZoneEvent.bind(this)}
					onDragHandlePress={this._handleDragHandleEvent.bind(this)}
					onButtonClick={this._handleButtonClick.bind(this)}
					lib={this.libraryMethods}/>
			</Provider>,
			this._refs.ui.app
		);
	},

	/**
	 * @param {string} mode - One of the dialogModes modes.
	 * @param {mixed} data - Relevant data to store for the dialog to use.
	 * @param {function} [onDialogComplete] - Function to invoke on dialog completion.
	 * @param {function} [onDialogCancel] - Function to invoke on dialog cancellation.
	 * @returns {mixed} undefined, or a Promise in the case that neither callback is defined.
	 * @description
	 *	Displays a dialog element. In this case that no callbacks (`onDialogComplete` or
	 * `onDialogCancel` are defined, a Promise is returned, the resolve/reject methods
	 * of which denote completion or cancellation of the dialog.
	 * @private
	 */
	_showDialog: function(mode, data) {
		return new Promise((resolve) => {
			this._store.dispatch(actions.setDialogMode(
				mode,
				data,
				(data, action, action_data) => {
					resolve({ data, action, action_data });
				},
				resolve
			));
		});
	},

	/**
	 * @description
	 * Hides the dialog (after a short timeout) - uses state comparison to ensure
	 * the dialog being hidden isn't a new one.
	 */
	_hideDialog: function() {
		var state = (this._store.getState()).UI.dialog;

		window.setTimeout(function() {
			var inner_state = (this._store.getState()).UI.dialog;

			if (state.id === inner_state.id) {
				// still the same dialog - close it
				this._store.dispatch(actions.setDialogMode(dialogModes.NONE));
			}
		}.bind(this), 300);
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
				// this._queueDragDropBinding('drag', collection, key);
				break;

			case 'dropzone':
				// this._queueDragDropBinding('drop', 'dropzone_target', key);
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
		var state = this._store.getState();

		if (state.UI.active_droplet_id === '') {
			// only allow editing if there is no droplet placement occuring
			this._showDialog(dialogModes.EDIT_DROPLET, {
				droplet_id: droplet.id,
				zone_id: drop_zone.id,
				attachment_index
			})
				.then(((dialog) => {
					this._hideDialog();

					if (dialog) {
						if (dialog.action === 'remove_droplet') {
							this.zoneDetachAttachment(
								dialog.action_data.zone_id,
								dialog.action_data.attachment_index
							);
						} else {
							this._commitDropletIntoDropZone.apply(this, [dialog.data]);
						}
					}
				}).bind(this));
		}
	},

	_handleDropletEvent: function(event, droplet) {
		var state;

		if (event.type === 'click') {
			state = this._store.getState();

			if (state.UI.active_droplet_id !== droplet.id) {
				this._store.dispatch(actions.setActiveDroplet(droplet.id));
			} else {
				this._store.dispatch(actions.setActiveDroplet(''));
			}
		}
	},

	_handleDropZoneEvent: function(event, drop_zone) {
		var state = this._store.getState(),
			droplet;

		if (event.type === 'click' &&
			state.UI.active_droplet_id !== '' &&
			(droplet = this.getDropletById(state.UI.active_droplet_id))) {
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

	_handleButtonClick: function(button, event) {
		var offset = {},
			rect, circle;

		if (button && event && event.pageX && event.pageY &&
			(circle = button.querySelector(this.settings.selectors.button_circle))) {
			// get metrics and offset by scroll
			rect = button.getBoundingClientRect();
			rect.leftScrolled = rect.left + window.pageXOffset;
			rect.topScrolled = rect.top + window.pageYOffset;

			// calculate cursor offset on the button
			offset.left = event.pageX - (rect.left + window.pageXOffset);
			offset.top = event.pageY - (rect.top + window.pageYOffset);

			// position the circle based on the pointer position on the button
			circle.classList.remove(this.settings.classes.button_animate);
			circle.style.left = offset.left - (circle.offsetWidth / 2) + 'px';
			circle.style.top = offset.top - (circle.offsetHeight / 2) + 'px';
			circle.classList.add(this.settings.classes.button_animate);
		}
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
				})
					.then((dialog) => {
						this._hideDialog();

						if (dialog) {
							this._commitDropletIntoDropZone.apply(this, [dialog.data]);
						}
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

	_commitDropletIntoDropZone: function(data) {
		var dialog = (this._store.getState()).UI.dialog;

		// reset dialog state to nothing
		this._hideDialog();

		// droplet being edited prior to or during attatchment
		if (dialog.data.attachment_index === null) {
			// no attachment index - this is a new drop
			this.zoneAddAttachment(
				dialog.data.zone_id,
				dialog.data.droplet_id,
				data
			);
		} else{
			this.zoneEditAttachment(
				dialog.data.zone_id,
				dialog.data.attachment_index,
				data
			);
		}
	},

	zoneAddAttachment: function(zone_id, droplet_id, data) {
		this._store.dispatch(actions.zoneAddAttachment(
			zone_id,
			droplet_id,
			true,
			data
		));

		if (this.settings.view.autoUpdate) {
			this._updateView();
		}
	},

	zoneEditAttachment: function(zone_id, attachment_index, data) {
		this._store.dispatch(actions.zoneEditAttachment(
			zone_id,
			attachment_index,
			data
		));

		if (this.settings.view.autoUpdate) {
			this._updateView();
		}
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
	},

	_setUIPopperAttachment: function(attachment, element, options) {
		var attached;

		if (attachment instanceof window.HTMLElement) {
			attached = attachment;
		} else if (attachment && attachment.selector) {
			attached = document.querySelector(attachment.selector);
		}

		if (attached) {
			return new Popper(
				attached,
				element,
				attachment.options || options
			);
		} else {
			throw new Error('_setUIPopperAttachment: Attachment or selector could not be found.');
		}
	}
};

export default UI;