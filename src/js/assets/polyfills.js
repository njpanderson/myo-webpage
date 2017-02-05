// JS Polyfills - doesn't export anything, just modifies existing Object specs
Object.deepAssign = function(target, varArgs) { // .length of function is 2
	'use strict';

	if (target == null) { // TypeError if undefined or null
		throw new TypeError('Cannot convert undefined or null to object');
	}

	if (varArgs.constructor === Array && arguments.length === 2) {
		// arrays to retain their identity
		var to = Array(target);
	} else {
		// otherwise use an object
		var to = Object(target);
	}

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