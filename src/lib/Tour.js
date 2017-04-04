import dialogs from '../assets/dialogs';
import { dialogModes } from '../assets/constants';

var Tour = function(parent) {
	this._parent = parent;
};

Tour.prototype = {
	intro: function() {
		return this._parent._showDialog(dialogModes.GENERAL, Tour.dialogs.intro)
			.then(this._parent._hideDialog.bind(this._parent));
	},

	start: function() {
		this._progressTour();
	},

	_progressTour: function(index = 0) {
		if ((Tour.dialogs.tour.length - 1) >= index) {
			this._showTourElement(index)
				.then(() => {
					this._progressTour((index + 1));
				});
		} else {
			this._parent._hideDialog();
		}
	},

	_showTourElement(index) {
		return this._parent._showDialog(
			dialogModes.GENERAL,
			Tour.dialogs.tour[index]
		)
			.catch(this._parent._hideDialog);
	}
};

Tour.dialogs = {
	intro: dialogs.intro,
	tour: dialogs.tour
};

export default Tour;