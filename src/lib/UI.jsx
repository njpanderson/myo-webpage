/**
 * @typedef DialogData
 * @property {string} title - The title of the dialog.
 * @property {array|string} message - Either a single string or an array of strings, defining
 * each paragraph of the dialog message. Basic HTML is allowed.
 * @property {FormButton[]|undefined} buttons - An array of FormButton buttons, or leave undefined
 * to use the default "OK" button.
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Popper from 'popper.js';

import DragDrop from './DragDrop';
import Communicator from './Communicator';
import Tour from './Tour';
import Template from '../lib/Template';
import { GLYPHS } from '../components/views/Icon.jsx';

import CanvasContainer from '../components/containers/CanvasContainer';

import actions from '../state/actions';
import createDialogs from '../assets/dialogs';

import { dialogModes, uiStates, messageCommands } from '../assets/constants';

/**
 * Handles User Interface components and acts as the main controller.
 * @class
 */
var UI = function(parent, settings, refs, data, store, template) {
	/**
	 * @private
	 */
	this._parent = parent;

	/**
	 * Settings as defined when instantiating. Inherits from {@link App.defaults}
	 */
	this.settings = settings;

	/**
	 * @private
	 */
	this._refs = refs;

	/**
	 * @private
	 */
	this._data = data;

	/**
	 * @private
	 */
	this._store = store;

	/**
	 * @private
	 */
	this._template = template;

	/**
	 * Dialog objects for use with {@link App#dialog}
	 */
	this.dialogs = createDialogs(settings);

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

		// has the drag handle been moved?
		dragHandleMoved: false
	};

	this._comms = new Communicator('app', window.location.origin, {
		message: this._handleAppMessage.bind(this)
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
					onDragHandleEvent={this._handleDragHandleEvent.bind(this)}
					onButtonClick={this._handleButtonClick.bind(this)}
					lib={this.libraryMethods}/>
			</Provider>,
			this._refs.ui.app
		);
	},

	/**
	 * Handles messages sent via the Communicator class (mainly from the View class).
	 * @param {object} message - Data, as sent by the originator
	 * @param {string} id - Message ID.
	 * @private
	 */
	_handleAppMessage: function(message, id) {
		switch (message.cmd) {
		case 'dialog':
			// a dialog is being requested
			this._showCommunicatorDialog(
				message.data.title,
				message.data.message,
				message.data.buttons,
				id
			);
			break;
		}
	},

	/**
	 * @param {string} mode - One of the dialogModes modes.
	 * @param {DialogData} data - Relevant data to store for the dialog to use.
	 * @returns {DialogPromise} a Promise which will resolve with the dialog results.
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
				() => {
					resolve({ action: 'cancel' });
				}
			));
		});
	},

	/**
	 * @description
	 * Hides the dialog (after a short timeout) - uses state comparison to ensure
	 * the dialog being hidden isn't a new one.
	 * @private
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

	_showCommunicatorDialog(title, message, buttons, comms_id) {
		this._showDialog(
			dialogModes.GENERAL,
			{
				title,
				message,
				buttons
			}
		)
			.then((dialog) => {
				this._hideDialog();

				if (dialog) {
					// submit/custom callback
					this._comms.send('view', {
						cmd: messageCommands.DIALOG_CALLBACK,
						data: dialog.data,
						action: dialog.action,
						action_data: dialog.action_data
					}, comms_id);
				} else {
					// cancel callback
					this._comms.send('view', {
						cmd: messageCommands.DIALOG_CALLBACK
					}, comms_id);
				}
			});
	},

	/**
	 * @param {string} collection - The element's collection name.
	 * @param {HTMLElement} element - The element being collected.
	 * @param {string} key - The collection's key name.
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
	 * @param {string} collection - The element's collection name.
	 * @param {string} key - The collection's key name.
	 * @description
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
	 * @param {string} type - Either 'drag' or 'drop'.
	 * @param {string} collection - The ref collection.
	 * @param {string} key - The ref key, within the collection.
	 * @param {ojbect} settings - The settings for the interaction.
	 * @description
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

	/**
	 * Processes queued up drag/drop bindings created by UI#_queueDragDropBindings.
	 * @param {array} [queue] - The bindings queue.
	 * @private
	 */
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

			// create a DragDrop instance and assign to the palette item data
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

	/**
	 * Handle a click on a Drop Zone attachment item. May produce an editor window.
	 * @param {Droplet} droplet - The Droplet.
	 * @param {DropZone} drop_zone - The Drop Zone.
	 * @param {number} attachment_index - The Drop Zone's attachment index, if it applies.
	 * @private
	 */
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

					if (dialog.action === 'remove_droplet') {
						this.zoneDetachAttachment(
							dialog.action_data.zone_id,
							dialog.action_data.attachment_index
						);
					} else if (dialog.action !== 'cancel') {
						this._commitDropletIntoDropZone.apply(this, [dialog.data]);
					}
				}).bind(this));
		}
	},

	/**
	 * Handles events being fired from a Droplet
	 * @param {ReactEvent} event - The event object.
	 * @param {Droplet} droplet - The Droplet.
	 * @private
	 */
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

	/**
	 * Handles events being fired from a Drop Zone.
	 * @param {ReactEvent} event - The event object.
	 * @param {DropZone} drop_zone - The Drop Zone.
	 * @private
	 */
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
	 * Handles events from the drag handle (between template and view containers).
	 * @param {ReactEvent} event - The event object.
	 * @private
	 */
	_handleDragHandleEvent: function(event) {
		var width;

		switch (event.type) {
		case 'mouseenter':
		case 'mouseleave':
			if (!this._data.UI.dragHandleMoved) {
				if (event.type === 'mouseenter') {
					this._store.dispatch(actions.setTooltipContent(
						'Drag handle',
						'<b>Drag</b> this handle to resize the template and the view.' +
							' <b>Press</b> to toggle the full page view.',
						GLYPHS.RESIZE_WIDTH
					));
					this._store.dispatch(actions.showTooltip(
						this._getReferencedElement('drag_handle'),
						{
							placement: 'left',
							modifiers: {
								flip: ['left', 'right']
							}
						}
					));
				} else {
					this._store.dispatch(actions.hideTooltip());
				}
			}
			break;

		case 'dragmove':
			// incrememt dragHandlePosition based on x delta from interact instance
			this._data.UI.dragHandlePosition += event.dx;

			if (!this._data.UI.dragHandleMoved) {
				// remove the tooltip, in case it's still around
				this._data.UI.dragHandleMoved = true;
				this._store.dispatch(actions.hideTooltip());
			}

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

	/**
	 * Updates various metrics when the window has been resized
	 * @private
	 */
	_handleWindowResize: function() {
		this._data.UI.drag_handle_x = (this._getReferencedElement('drag_handle')).offsetLeft;
		this._data.UI.vp_width =
			Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		// reset dragHandlePosition because the metrics have changed
		this._data.UI.dragHandlePosition = 0;
	},

	/**
	 * Generically handles the click of any button within the UI.
	 * @param {HTMLElement} button - The button being clicked.
	 * @param {ReactEvent} event - The event object.
	 */
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

	/**
	 * Checks to see if a Droplet drop on a Drop Zone is valid. I.e. it can be dropped.
	 * @param {Droplet} droplet - The Droplet being dropped.
	 * @param {DropZone} drop_zone - The Drop Zone being dropped into.
	 * @private
	 */
	_isValidDrop: function(droplet, drop_zone) {
		return drop_zone.willAccept(droplet, this._store);
	},

	/**
	 * Optionally displays an editing dialog and then attaches the Droplet to a Drop Zone.
	 * @param {Droplet} droplet - The Droplet to attach
	 * @param {DropZone} drop_zone - The Drop Zone to attach it to.
	 */
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

						if (dialog.action === 'submit') {
							this._commitDropletIntoDropZone.apply(this, [dialog.data]);
							this._postDropletAttachment(droplet, dialog.data);
						}
					});
			} else {
				// add attachment without dialog
				this.zoneAddAttachment(
					drop_zone.id,
					droplet.id,
					droplet.data
				);

				this._postDropletAttachment(droplet, droplet.data);
			}

			return true;
		} else {
			if (this.settings.dropZone.warnOnBadPlacement) {
				this._showDialog(dialogModes.GENERAL, this.dialogs.dropletBadPlacement)
					.then(this._hideDialog);
			}

			return false;
		}
	},

	/**
	 * Perform actions after Droplet attachment.
	 * @param {Droplet} droplet - The Droplet instance.
	 * @param {object} data - The Droplet data to be set into the Drop Zone.
	 * @private
	 */
	_postDropletAttachment: function(droplet, data) {
		var state = this._store.getState(),
			keys = Object.keys(state.zones),
			notice = false,
			key, droplet_output;

		// should we display a "first droplet" notice?
		if (this.settings.dropZone.noticeOnFirstPlacement &&
			(!state.app.first_valid_drop && keys.length > 0)) {
			// set first droplet state
			this._store.dispatch(actions.completeFirstDrop());

			// format the droplet for display
			droplet_output = Template.entities(
				Template.renderDroplet(
					droplet,
					Object.deepAssign({}, droplet.data, data),
					null,
					false
				)
			);

			// show dialog
			this._showDialog(
				dialogModes.GENERAL,
				this.dialogs.firstDropletDrop(droplet_output)
			)
				.then(this._hideDialog);
		}

		// should we display a "last droplet" notice?
		if (this.settings.dropZone.noticeOnLastPlacement &&
			(!state.app.last_valid_drop && keys.length === this._data.palette.length)) {
			notice = true;

			// check zones all have placements
			for (key in state.zones) {
				if (state.zones[key].attachments.length === 0) {
					notice = false;
					break;
				}
			}

			if (notice) {
				// show set last drop state
				this._store.dispatch(actions.completeLastDrop());

				// show dialog
				this._showDialog(
					dialogModes.GENERAL,
					this.dialogs.lastDropletDrop
				)
					.then(this._hideDialog);
			}
		}
	},

	/**
	 * @param {object} data - The Droplet data to be set into the Drop Zone.
	 * @description
	 * Called after editing dialog has been completed, either adds a new
	 * Drop Zone attachment or edits an existing one.
	 * @private
	 */
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

	/**
	 * Adds a Drop Zone attachment.
	 * @param {string} zone_id - The Drop Zone ID.
	 * @param {string} droplet_id - The Droplet ID.
	 * @param {object} data - The droplet data to be set into the Drop Zone.
	 */
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

	/**
	 * Edits an existing Drop Zone attachment at `attachment_index` index.
	 * @param {string} zone_id - The Drop Zone ID.
	 * @param {number} attachment_index - The existing attachment index.
	 * @param {object} data - The new droplet data to be replaced into the Drop Zone.
	 */
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

	/**
	 * Detaches a Droplet attachment from a Drop Zone by its `attachment_index` index.
	 * @param {string} zone_id - Drop Zone ID.
	 * @param {number} attachment_index - The existing attachment index.
	 */
	zoneDetachAttachment: function(zone_id, attachment_index) {
		this._store.dispatch(actions.zoneDetachAttachment(
			zone_id,
			attachment_index
		));
	},

	/**
	 * Retrieve a zone's attachment by its `attachment_index` index.
	 * @param {string} zone_id - Drop Zone ID.
	 * @param {number} attachment_index - The existing attachment index.
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

	/**
	 * Sends a key the View frame for updating.
	 */
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

	/**
	 * Retrieves a Droplet instance by its ID.
	 * @param {string} id - ID of the Droplet to retrieve.
	 */
	getDropletById: function(id) {
		return this._data.palette.find((element) => {
			return element.id === id;
		});
	},

	/**
	 * Retrieves a Drop Zone instance by its ID.
	 * @param {string} id - ID of the Drop Zone to retrieve.
	 */
	getDropZoneById: function(id) {
		return this._data.drop_zones[id] || null;
	},

	/**
	 * @param {HTMLElement} attachment - The element to attach to.
	 * @param {HTMLElement} element - The element being attached.
	 * @param {object} options - The popper `options` object (see link).
	 * @description
	 * Using 'popper', sets the an attachment from the `attachment` node to an `element`
	 * defining the "popup" to be displayed.
	 * @see https://popper.js.org/popper-documentation.html#new_Popper_new
	 * @private
	 */
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