import { combineReducers } from 'redux';

import defaultState from '../assets/default-state';
import { actionTypes, uiStates, tourModes } from '../assets/constants';
import Storage from '../lib/Storage';

var dialog_id = 0,
	storage = new Storage('tag_app');

/**
 * Sets application state values.
 * @private
 */
function app(state = defaultState.app, action) {
	var active, newstate;

	switch (action.type) {
	// set ui state
	case actionTypes.UI_STATE:
		// set 'active' flag based on the ui_state value
		switch (action.ui_state) {
		case uiStates.ACTIVE:
			active = true;
			break;

		default:
			active = false;
		}

		newstate = Object.assign({}, state, {
			ui_state: action.ui_state,
			active
		});

		storeState(newstate, 'app');
		return newstate;

	case actionTypes.COMPLETE_FIRST_DROP:
		newstate = Object.assign({}, state, {
			first_valid_drop: true
		});

		storeState(newstate, 'app');
		return newstate;

	default:
		return state;
	}
}

/**
 * Sets drop zone state values
 * @private
 */
function zones(state = defaultState.zones, action) {
	var zones = Object.assign({}, state);

	switch (action.type) {
	case actionTypes.ZONE_ADD_ATTACHMENT:
		if (!zones[action.id]) {
			zones[action.id] = {
				attachments: []
			};
		}

		// attach the droplet
		zones[action.id].attachments.push({
			droplet_id: action.droplet_id,
			data: action.data
		});

		break;

	case actionTypes.ZONE_EDIT_ATTACHMENT:
		if (zones[action.id].attachments[action.attachment_index]) {
			zones[action.id].attachments[action.attachment_index].data = action.data;
		}

		break;

	case actionTypes.ZONE_DETACH_ATTACHMENT:
		// detach the attachment by index
		if (action.attachment_index !== null &&
			action.attachment_index < zones[action.id].attachments.length) {
			zones[action.id].attachments.splice(action.attachment_index, 1);
		}

		break;

	case actionTypes.ZONE_CLEAR_ALL_ATTACHMENTS:
		zones = {};
		break;

	default:
		return state;
	}

	storeState(zones, 'zones');

	return zones;
}

/**
 * Sets UI state values. This state collection is non persistant and will not be stored
 * within local/session storage. Due to that fact, it is safe to place circular references,
 * functions and large quantities of data in here.
 * @private
 */
function UI(state = defaultState.UI, action) {
	switch (action.type) {
	case actionTypes.SET_DIALOG_MODE:
		return Object.assign({}, state, {
			dialog: {
				mode: action.mode,
				data: action.data,
				onDialogComplete: action.onDialogComplete,
				onDialogCancel: action.onDialogCancel,
				overlay: (typeof action.overlay !== 'undefined' ? action.overlay : true),
				attachment: action.attachment,
				id: 'dialog-' + (++dialog_id)
			}
		});

	case actionTypes.SET_ACTIVE_DROPLET:
		// set the active droplet (i.e. the one that will be "dropped" when a
		// drop zone is next clicked
		return Object.assign({}, state, {
			active_droplet_id: action.droplet_id
		});

	case actionTypes.SHOW_TOOLTIP:
	case actionTypes.HIDE_TOOLTIP:
		if (action.type === actionTypes.SHOW_TOOLTIP) {
			return Object.assign({}, state, {
				tooltip: {
					show: true,
					attachment: action.attachment,
					options: action.options,
					content: state.tooltip.content,
					title: state.tooltip.title,
					iconGlyph: state.tooltip.iconGlyph
				}
			});
		} else {
			return Object.assign({}, state, {
				tooltip: {
					show: false,
					attachment: null,
					options: null,
					content: '',
					title: '',
					iconGlyph: ''
				}
			});
		}

	case actionTypes.SET_TOOLTIP_CONTENT:
		return Object.assign({}, state, {
			tooltip: {
				show: state.tooltip.show,
				content: action.content,
				title: action.title,
				iconGlyph: action.iconGlyph
			}
		});

	default:
		return state;
	}
}

/**
 * Stores state into local/session storage for recall on reloading the app.
 * @private
 */
function storeState(state, key) {
	var current_state = storage.get('state'),
		new_state;

	new_state = Object.assign({}, defaultState, current_state);
	new_state[key] = Object.assign({}, state);
	new_state.UI = null;

	storage.set('state', new_state);
}


export default combineReducers({
	app,
	zones,
	UI
});