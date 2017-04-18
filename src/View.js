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

			this._evalScripts();
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

	/**
	 * Gather scripts (besides view script) and re-insert in order
	 */
	_evalScripts: function() {
		this._scripts = [];

		Array.prototype.slice.apply(document.querySelectorAll('.view script'))
			.forEach((script, index) => {
				var new_script;

				new_script = document.createElement('script');
				new_script.src = script.src;
				new_script.type = script.type;
				new_script.onload = function() {
					this._loadScript(index + 1);
				}.bind(this);

				this._scripts.push({
					new: new_script,
					old: script
				});
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
	}
};

export default View;