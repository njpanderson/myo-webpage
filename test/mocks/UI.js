import defaults from '../fixtures/defaults';

import defaultState from '../../src/assets/default-state';
import createDialogs from '../../src/assets/dialogs';

var UI = function() {
	this.__resolve_showDialog = (resolve) => {
		resolve();
	};

	this._store.dispatch = this._store.dispatch.bind(this);

	this.dialogs = createDialogs(defaults);
};

UI.prototype = {
	render: function() {
		return true;
	},

	_showDialog: function(mode, data) {
		this.__test_stats._showDialog.push({ mode, data });
		return new Promise(this.__resolve_showDialog);
	},

	_hideDialog: function() {
		this.__test_stats._hideDialog += 1;
		return Promise.resolve();
	},

	_store: {
		getState: function() {
			return defaultState;
		},
		dispatch: function(action) {
			this.__test_stats.dispatches.push(action);
		}
	},

	__set_test_stats: function(stats) {
		this.__test_stats = stats;
	},

	__set_showDialog_resolver: function(fn) {
		this.__resolve_showDialog = fn.bind(this);
	}
};

export default UI;