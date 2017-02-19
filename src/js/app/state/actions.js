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

	zoneAddAttachment: function(id, droplet_id, attached, data) {
		return {
			type: types.ZONE_ADD_ATTACHMENT,
			id,
			droplet_id,
			attached,
			data
		};
	}
};