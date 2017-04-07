import { actionTypes } from '../assets/constants';

export default {
	setUIState: function(ui_state) {
		return {
			type: actionTypes.UI_STATE,
			ui_state
		};
	},

	setActiveDroplet: function(droplet_id) {
		return {
			type: actionTypes.SET_ACTIVE_DROPLET,
			droplet_id
		};
	},

	setDialogMode: function(mode, data = {}, onDialogComplete, onDialogCancel) {
		return {
			type: actionTypes.SET_DIALOG_MODE,
			mode,
			data,
			onDialogComplete,
			onDialogCancel
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
	},

	zoneDetachAttachment: function(id, attachment_index) {
		return {
			type: actionTypes.ZONE_DETACH_ATTACHMENT,
			id,
			attachment_index
		};
	},

	zoneClearAllAttachments: function() {
		return {
			type: actionTypes.ZONE_CLEAR_ALL_ATTACHMENTS
		};
	},

	setTourStage: function(stage) {
		return {
			type: actionTypes.SET_TOUR_STAGE,
			stage
		};
	}
};