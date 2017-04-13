export const registerGeneralEvent = function(component, id, info) {
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

export const collectRef = function(props, collection, key) {
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
export const validatePropKeys = function(require) {
	return function(props, key, component) {
		var a;

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

/**
 * Escapes a string for use as a match within a regex
 * @see http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486
 */
export const escapeRegExp = function(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\$&');
};

export const rawMarkup = function(html) {
	return { __html: html };
};


/**
 * from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API.
 * Checks if localStorage works.
 * (localStorage can be disabled using security policies or private browsing modes)
 */
export const checkStorage = function(type) {
	try {
		var storage = window[type],
			x = '__tag_storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch(e) {
		return false;
	}
};

/**
 * @description
 * Provides loose comparison of the keys of two objects.
 * If the value of a key is an array, the test object's key is also confirmed to be the same type.
 * If the alue of a key is an object, it is tested recursively.
 * @param {object} test - Test object
 * @param {object} expected - Expected result
 */
export const structCompare = function(test, expected) {
	var result = true,
		key;

	if (typeof test !== 'object' || typeof expected !== 'object') {
		return false;
	}

	for (key in expected) {
		if (expected.hasOwnProperty(key)) {
			if (typeof expected[key] === 'object') {
				if (Array.isArray(expected[key])) {
					// expected value is an array
					if (!Array.isArray(test[key])) {
						result = false;
					}
				} else {
					// expect value is an object
					if ((key in test)) {
						// key exists in test
						result = structCompare(test[key], expected[key]);
					} else {
						result = false;
					}
				}
			} else {
				// value is (probably) scalar
				if (!(key in test)) {
					result = false;
				}
			}
		}

		// if the result is false at any point, just break here
		if (result === false) {
			break;
		}
	}

	return result;
};