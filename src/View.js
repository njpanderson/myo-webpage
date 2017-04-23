import Communicator from './lib/Communicator';
import { messageCommands } from './assets/constants';

/**
 * Handles the view frame communication with the App class.
 * @class
 */
var View = function(settings = {}) {
	this.settings = settings;
	this._comms = new Communicator('view', window.location.origin, {
		message: this._handleAppMessage.bind(this)
	});

	this._comms.registerGuestAddress('app', window.top);

	this._scripts = [];
	this._callbacks = {};

	this._createInternalEvents();
};

View.prototype = {
	/**
	 * Produces a dialog using the App class. Uses a callback workflow to avoid reliance
	 * on Promise polyfills or ES2015.
	 * @param {string} title - See {@link App#dialog}
	 * @param {mixes} message - See {@link App#dialog}
	 * @param {array} [buttons] - See {@link App#dialog}
	 * @param {function} [after] - Callback function to invoke once the dialog has been completed.
	 */
	dialog: function(title, message, buttons = [], after = null) {
		var id;

		// send a dialog command to the App class
		id = this._comms.send('app', {
			cmd: messageCommands.DIALOG,
			data: {
				title,
				message,
				buttons
			}
		});

		// store the callback for later invocation, based on the generated message ID
		this._callbacks[id] = after;
	},

	/**
	 * Handles messages sent via the Communicator class (mainly from the UI class).
	 * @param {object} message - Data, as sent by the originator
	 * @param {string} id - Message ID.
	 */
	_handleAppMessage: function(message, id) {
		switch (message.cmd) {
		case messageCommands.RELOAD:
			// reload request
			this.settings.container.innerHTML = message.data.markup;
			this._warnScripts();
			this._fire(this.settings.container, 'update');
			break;

		case messageCommands.RESET:
			this._reset();
			break;

		case messageCommands.DIALOG_CALLBACK:
			// message from a dialog triggered with View#dialog
			if (this._callbacks[id]) {
				// id exists within callack object, fire and delete
				this._callbacks[id].apply(this, [
					message.data,
					message.action,
					message.action_data
				]);

				this._callbacks[id] = null;
			}
		}
	},

	_fire: function(element, event) {
		if (element instanceof HTMLElement && this._events[event]) {
			element.dispatchEvent(this._events[event]);
		}
	},

	/**
	 * Gather any scripts within view and warn in order
	 */
	_warnScripts: function() {
		Array.prototype.slice.apply(this.settings.container.querySelectorAll('script'))
			.forEach((script, index) => {
				console.warn(
					'JS Script (' + (index + 1) + ') at "' + script.src + '"' +
					' should not be part of the template as it cannot be removed from memory on reload.' +
					' Please consider moving this script into your base View HTML.'
				);
			});

		this._loadScript(0);
	},

	_loadScript: function(index) {
		if (this._scripts[index]) {
			this._scripts[index].old.parentNode.replaceChild(
				this._scripts[index].new,
				this._scripts[index].old
			);
		}
	},

	_reset: function() {
		this.settings.container.innerHTML = '';
	},

	_createInternalEvents: function() {
		this._events = {};

		if (window.document &&  'createEvent' in window.document) {
			/**
			 * Fires after the view container has been updated with new markup.
			 * @event tag:update
			 */
			this._events.update = window.document.createEvent('Event');
			this._events.update.initEvent('tag:update', true, true);
		}
	}
};

export default View;