import default_state from '../assets/default-state.js';

import { combineReducers } from 'redux';
import types from './actionTypes';

var app, template, pallet;

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

template = function(state = default_state.template, action) {
	switch (action.type) {
	case types.TEMPLATE_SET:
		return Object.assign({}, state, {
			html: action.html
		});

	default:
		return state;
	}
};

pallet = function(state = default_state.pallet, action) {
	var pallet = Object.assign({}, state);

	switch (action.type) {
	case types.PALLET_ADD:
		pallet[action.id] = {
			attached: action.attached
		};

		break;

	case types.PALLET_REMOVE:
		delete pallet[action.id];
		break;

	case types.PALLET_SET_ATTACHED:
		if (pallet[action.id]) {
			pallet[action.id].attached = action.attached || false;
		}

		break;

	default:
		return state;
	}

	return pallet;
};

export default combineReducers({
	app,
	template,
	pallet
});