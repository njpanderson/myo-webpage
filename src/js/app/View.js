import Communicator from './lib/Communicator';
import messageCommands from './assets/message-commands';

var View = function() {
	this._comms = new Communicator('view', window.location.origin, {
		message: this._handleAppMessage
	});

	this._comms.registerGuestAddress('app', window.top);
};

View.prototype = {
	_handleAppMessage: function(message) {
		console.log('message to "view"!', message);

		if (message.cmd === messageCommands.RELOAD) {
			// reload request
			// console.log('reloading...');
			window.location.reload();
		}
	}
};

export default View;