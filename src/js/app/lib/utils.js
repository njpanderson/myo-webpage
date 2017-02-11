export let registerGeneralEvent = function(component, id, info) {
	var args = arguments;

	return function(event) {
		event.preventDefault();
		if (typeof component.props.onEvent === 'function') {
			component.props.onEvent.apply(component, [event, info, id].concat(
				Array.prototype.slice.call(args, 3)
			));
		}
	}.bind(this);
};

export let collectRef = function(props, collection, key) {
	return function(ref) {
		if (typeof props.refCollector === 'function') {
			props.refCollector(collection, ref, key);
		} else {
			throw new Error(
				'ref collection used but no collector has been set up for ' +
				collection + (key ? '/' + key : '')
			);
		}
	};
};

/**
 * Returns a function for validating specific keys within an object property.
 */
export let validatePropKeys = function(require) {
	return function(props, key, component) {
		let a;

		for (a = 0; a < require.length; a += 1) {
			if (!props[key].hasOwnProperty(require[a]) &&
				props[key][require[a]] !== undefined) {
				return new Error(
					'Prop	`' + key + '` does not contain definition `' + require[a] +
						'` in ' + component + ' component.'
				);
			}
		}
	};
};