// JS Polyfills - doesn't export anything, just modifies existing Object specs
Object.deepAssign = function(target, varArgs) {
	'use strict';

	var to, from, index, key;

	if (target == null) { // TypeError if undefined or null
		throw new TypeError('Cannot convert undefined or null to object');
	}

	to = (typeof varArgs !== 'undefined' &&
		(Array.isArray(varArgs) && arguments.length === 2)) ?
		Array(target) : // arrays to retain their identity
		Object(target); // otherwise use an object

	for (index = 1; index < arguments.length; index++) {
		from = arguments[index];

		if (from != null || typeof from === 'undefined') {
			for (key in from) {
				if (from.hasOwnProperty(key)) {
					if (typeof from[key] === 'object' && from[key] != null) {
						to[key] = Object.deepAssign(
							(Array.isArray(from[key]) ? [] : {}),
							to[key],
							from[key]
						);
					} else {
						to[key] = from[key];
					}
				}
			}
		}
	}

	return to;
};

/**
 * Curry implementation for functions
 */
Function.prototype.curry = function() {
	var args = Array.prototype.slice.call(arguments),
		fn = this;

	return function() {
		// return result of original function with curried arguments before invocation arguments
		return fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));
	};
};