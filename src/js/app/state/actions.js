import { actionTypes } from '../assets/constants';

module.exports = {
	setUIState: function(ui_state) {
		return {
			type: actionTypes.UI_STATE,
			ui_state
		};
	},

	setDialogMode: function(mode, state = {}) {
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
	},

	zoneEditAttachment: function(id, attachment_index, data) {
		return {
			type: actionTypes.ZONE_EDIT_ATTACHMENT,
			id,
			attachment_index,
			data
		};
	}
};