import types from './actionTypes';

module.exports = {
	palletAdd: function(data) {
		data = Object.assign({}, {
			attached: false,
			dropletType: 'text'
		}, data);

		return Object.assign({
			type: types.PALLET_ADD
		}, data);
	},

	palletRemove: function(id) {
		return {
			type: types.PALLET_REMOVE,
			id
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