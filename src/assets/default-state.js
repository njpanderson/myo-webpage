import { uiStates, dialogModes } from './constants.js';

// default state for...
export default {
	// general application
	app: {
		ui_state: uiStates.INITIALISING,
		active: false
	},

	// active zones and current attachments
	zones: {},

	// UI states - do not persist
	UI: {
		// the currently active dialog and its data
		dialog: {
			mode: dialogModes.NONE,
			data: null,
			onDialogComplete: null,
			onDialogCancel: null,
			overlay: true,
			attachment: null,
			id: ''
		},

		// the currently active droplet (i.e. the one that will be "dropped" when a
		// drop zone is next clicked)
		active_droplet_id: ''
	}
};