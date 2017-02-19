import default_state from '../assets/default-state.js';

import { combineReducers } from 'redux';
import types from './actionTypes';

var app, zones;

app = function(state = default_state, action) {
	switch (action.type) {
	case types.ACTIVATE:
		return Object.assign({}, state, {
			active: true
		});

	case types.DEACTIVATE:
		return Object.assign({}, state, {
			active: false
		});

	default:
		return state;
	}
};

zones = function(state = default_state.zones, action) {
	var zones = Object.assign({}, state),
		index;

	switch (action.type) {
	case types.ZONE_ADD_ATTACHMENT:
		if (!zones[action.id]) {
			zones[action.id] = {
				attachments: []
			};
		}

		if (action.attached) {
			// attach the droplet
			zones[action.id].attachments.push({
				droplet_id: action.droplet_id,
				data: action.data
			});
		} else {
			// find and detach the droplet
			index = zones[action.id].attachments.findIndex((element) =>
				(element.droplet_id === action.droplet_id)
			);

			if (index !== -1) {
				zones[action.id].attachments.splice(index, 1);
			}
		}

		break;

	default:
		return state;
	}

	return zones;
};

export default combineReducers({
	app,
	zones
});