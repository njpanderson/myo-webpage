import React from 'react';

import { Icon, GLYPHS } from './views/Icon.jsx';

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

/**
 * Returns a React component containing an error string.
 */
export const getFieldErrorMarkup = function(error) {
	if (error) {
		return (
			<p className="error">
				<Icon glyph={GLYPHS.WARNING} width={12} height={12}/>
				<span>{error}</span>
			</p>
		);
	} else {
		return null;
	}
};