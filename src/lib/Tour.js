import dialogs from '../assets/dialogs';
import { dialogModes } from '../assets/constants';

var Tour = function(parent) {
	this._parent = parent;
};

Tour.prototype = {
	intro: function() {
		this._parent._showDialog(dialogModes.GENERAL, Tour.dialogs.intro);
	},

	tour: function() {

	}
};

Tour.dialogs = {
	intro: dialogs.intro
};

export default Tour;