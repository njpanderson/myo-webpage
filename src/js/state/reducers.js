import default_state from '../assets/default-state.js';

import { combineReducers } from 'redux';
import { ACTIVATE, DEACTIVATE, PALLET_ADD, PALLET_REMOVE } from './actionTypes';

var app, pallet;

app = function(state = default_state, action) {
	switch (action.type) {
	case ACTIVATE:
		return Object.assign({}, state, {
			active: true
		});

	case DEACTIVATE:
		return Object.assign({}, state, {
			active: false
		});

	default:
		return state;
	}
};

pallet = function(state = default_state.pallet, action) {
	switch (action.type) {
	case PALLET_ADD:
		return [
			...state, {
				id: action.id,
				name: action.name,
				value: action.value,
				dropletType: action.dropletType,
				attachmentId: action.attachmentId,
				attached: action.attached
			}
		];

	case PALLET_REMOVE:
		return state
			.filter((element) => {
				return element.id !== action.id;
			});

	default:
		return state;
	}
};

module.exports = combineReducers({
	pallet,
	app
});