import { uiStates, dialogModes } from './constants.js';

export default {
	app: {
		ui_state: uiStates.INITIALISING,
		active: true
	},
	zones: {},
	dialog: {
		mode: dialogModes.NONE,
		state: {}
	}
};