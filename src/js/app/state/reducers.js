import default_state from '../assets/default-state.js';

import { combineReducers } from 'redux';
import types from './actionTypes';

var app, pallet;

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

pallet = function(state = default_state.palletAttachments, action) {
	var pallet = Object.assign({}, state);

	switch (action.type) {
	case types.PALLET_SET_ATTACHED:
		if (!pallet[action.id]) {
			pallet[action.id] = {};
		}

		pallet[action.id].attached = action.attached || false;

		break;

	default:
		return state;
	}

	return pallet;
};

export default combineReducers({
	app,
	pallet
});