import React from 'react';

export const optionValueSet = function(values) {
	var nodes = [], key;

	if (Array.isArray(values)) {
		values.forEach(function(value, index) {
			var key = 'item-' + index;
			nodes.push(
				<option key={key} value={value}>{value}</option>
			);
		});
	} else if (typeof values === 'object') {
		for (key in values) {
			nodes.push(
				<option key={key} value={key}>{values[key]}</option>
			);
		}
	}

	return nodes;
};