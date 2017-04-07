import dialogs from '../assets/dialogs';
import { dialogModes } from '../assets/constants';
import actions from '../state/actions';

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

	_progressTour: function(index = null) {
		var state;

		// get next tour item from state or default
		if (index === null) {
			state = (this._parent._store.getState()).UI;
			index = (state.tour_stage !== null) ? (state.tour_stage + 1) : 0;
		}

		if ((Tour.dialogs.tour.length - 1) >= index) {
			this._setTourStage(index);
			this._showTourElement(index)
				.then((data) => {
					if (data.action === 'pause') {
						this._parent._hideDialog();
					} else {
						this._progressTour((index + 1));
					}
				});
		} else {
			this._setTourStage(null);
			this._parent._hideDialog();
		}
	},

	_showTourElement(index) {
		return this._parent._showDialog(
			dialogModes.TOUR,
			Tour.dialogs.tour[index]
		)
			.catch(this._parent._hideDialog);
	},

	_setTourStage: function(stage) {
		this._parent._store.dispatch(
			actions.setTourStage(stage)
		);
	}
};

Tour.dialogs = {
	intro: dialogs.intro,
	tour: dialogs.tour
};

export default Tour;