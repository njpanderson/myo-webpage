import types from './actionTypes';

module.exports = {
	activate: function() {
		return {
			type: types.ACTIVATE
		};
	},

	deactivate: function() {
		return {
			type: types.DEACTIVATE
		};
	},

	palletSetAttached: function(id, attached) {
		return {
			type: types.PALLET_SET_ATTACHED,
			id,
			attached
		};
	}
};