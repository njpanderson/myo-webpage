import { actionTypes } from '../assets/constants';

module.exports = {
	activate: function() {
		return {
			type: actionTypes.ACTIVATE
		};
	},

	deactivate: function() {
		return {
			type: actionTypes.DEACTIVATE
		};
	},

	setUIState: function(ui_state) {
		return {
			type: actionTypes.UI_STATE,
			ui_state
		};
	},

	setDialogMode: function(mode, state) {
		return {
			type: actionTypes.SET_DIALOG_MODE,
			mode,
			state
		};
	},

	zoneAddAttachment: function(id, droplet_id, attached, data) {
		return {
			type: actionTypes.ZONE_ADD_ATTACHMENT,
			id,
			droplet_id,
			attached,
			data
		};
	}
};