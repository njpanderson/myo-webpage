import Communicator from './lib/Communicator';
import { messageCommands } from './assets/constants';

var View = function(settings = {}) {
	this.settings = settings;
	this._comms = new Communicator('view', window.location.origin, {
		message: this._handleAppMessage.bind(this)
	});

	this._comms.registerGuestAddress('app', window.top);
};

View.prototype = {
	_handleAppMessage: function(message) {
		console.log('message to "view"!', message);

		if (message.cmd === messageCommands.RELOAD) {
			// reload request
			console.log('reloading...');
			console.log(message.data);
			this.settings.container.innerHTML = message.data.markup;
			// window.location.reload();
		}
	}
};

export default View;