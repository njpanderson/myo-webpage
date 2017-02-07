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
	switch (action.type) {
	case types.PALLET_ADD:
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

	case types.PALLET_REMOVE:
		return state
			.filter((element) => {
				return element.id !== action.id;
			});

	case types.PALLET_SET_ATTACHED:
		return state
			.map((element) => {
				if (element.id === action.id) {
					element.attached = action.attached;
				}

				return element;
			});

	default:
		return state;
	}
};

module.exports = combineReducers({
	app,
	template,
	pallet
});