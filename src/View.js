import Communicator from './lib/Communicator';
import { messageCommands } from './assets/constants';

var View = function(settings = {}) {
	this.settings = settings;
	this._comms = new Communicator('view', window.location.origin, {
		message: this._handleAppMessage.bind(this)
	});

	this._comms.registerGuestAddress('app', window.top);

	this.scripts = [];
};

View.prototype = {
	_handleAppMessage: function(message) {
		// console.log('message to "view"!', message);

		switch (message.cmd) {
		case messageCommands.RELOAD:
			// reload request
			// console.log('reloading...');
			// console.log(message.data);
			this.settings.container.innerHTML = message.data.markup;

			this._evalScripts();
			break;

		case messageCommands.RESET:
			this._reset();
		}
	},

	/**
	 * Gather scripts (besides view script) and re-insert in order
	 */
	_evalScripts: function() {
		this.scripts = [];

		document.querySelectorAll('.view script').forEach((script, index) => {
			var new_script;

			new_script = document.createElement('script');
			new_script.src = script.src;
			new_script.type = script.type;
			new_script.onload = function() {
				this._loadScript(index + 1);
			}.bind(this);

			this.scripts.push({
				new: new_script,
				old: script
			});
		});

		this._loadScript(0);
	},

	_loadScript: function(index) {
		if (this.scripts[index]) {
			this.scripts[index].old.parentNode.replaceChild(
				this.scripts[index].new,
				this.scripts[index].old
			);
		}
	},

	_reset: function() {
		this.settings.container.innerHTML = '';
	}
};

export default View;