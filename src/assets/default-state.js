import { uiStates, dialogModes } from './constants.js';

// default state for...
export default {
	// general application
	app: {
		ui_state: uiStates.INITIALISING,
		active: false,
		active_droplet_id: ''
	},

	// active zones and current attachments
	zones: {},

	// dialog mode and state
	dialog: {
		mode: dialogModes.NONE,
		state: {}
	}
};