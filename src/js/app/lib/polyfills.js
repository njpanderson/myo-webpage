// JS Polyfills - doesn't export anything, just modifies existing Object specs
Object.deepAssign = function(target, varArgs) {
	'use strict';

	var to;

	if (target == null) { // TypeError if undefined or null
		throw new TypeError('Cannot convert undefined or null to object');
	}

	to = (varArgs.constructor === Array && arguments.length === 2) ?
		Array(target) : // arrays to retain their identity
		Object(target); // otherwise use an object

	for (var index = 1; index < arguments.length; index++) {
		var nextSource = arguments[index];

		if (nextSource != null) { // Skip over if undefined or null
			for (var nextKey in nextSource) {
				// Avoid bugs when hasOwnProperty is shadowed
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					if (typeof nextSource[nextKey] === 'object' && nextSource[nextKey] != null) {
						to[nextKey] = Object.deepAssign({}, nextSource[nextKey]);
					} else {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
	}

	return to;
};