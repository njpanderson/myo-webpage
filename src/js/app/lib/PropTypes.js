/**
 * Takes multiple functions and returns a function which invokes them consecutively
 * with the same argument signature: (prop) `value`, `propname`, `droplet_name`, `droplet_type`.
 */
function chain() {
	var args = Array.prototype.slice.call(arguments);

	return function(value, propname, droplet_name, droplet_type) {
		var test = true;

		// run each function in the chain
		args.forEach((fn) => {
			if (!fn.apply(this, [value, propname, droplet_name, droplet_type])) {
				test = false;
			}
		});

		return test;
	};
}

/**
 * Asserts the `test` value is truthy. In the case that it fails, an Error is thrown.
 * @param {boolean} test - Test expression result
 * @param {string} propname - The name of the property being tested
 * @param {string} message - The message, in case of failure. Will be appended to a general
 * error message.
 * @param {string} [droplet_name] - The name of the Droplet being tested
 * @param {string} [toplet_type] - The dropletType attribute of the Droplet being tested
 */
function assert(test, propname, message, droplet_name, droplet_type) {
	var error, prop_id;

	if (!test) {
		if (droplet_name) {
			prop_id = '"' + droplet_name + '"' + (droplet_type ? ' (' + droplet_type + ')' : '');
		}

		error =  'Error in Droplet' +
			(prop_id ? ' ' + prop_id + ' ' : ' ') +
			'prop "' + propname + '". ' + message;
		throw new Error(error);
	} else {
		return true;
	}
}

function isRequired(value, prop, droplet_name, droplet_type) {
	return assert(
		(typeof value !== 'undefined'), prop, 'Value is required.', droplet_name, droplet_type
	);
}

function stringNotEmpty(value, prop, droplet_name, droplet_type) {
	return assert(
		(typeof value !== 'undefined' && value !== ''), prop, 'Value cannot be empty.', droplet_name, droplet_type
	);
}

function string(value, prop, droplet_name, droplet_type) {
	return assert(
		(typeof value === 'undefined' || typeof value === 'string'),
		prop,
		'Value must be a string.',
		droplet_name,
		droplet_type
	);
}

string.isRequired = chain(string, isRequired);
string.notEmpty = chain(string, stringNotEmpty);
string.notEmpty.isRequired = chain(string, stringNotEmpty, isRequired);

function object(value, prop, droplet_name, droplet_type) {
	return assert(
		(typeof value === 'undefined' || typeof value === 'object'),
		prop,
		'Value must be an object.',
		droplet_name,
		droplet_type
	);
}

object.isRequired = chain(object, isRequired);

function array(value, prop, droplet_name, droplet_type) {
	return assert(
		Array.isArray(value), prop, 'Value must be an array.', droplet_name, droplet_type
	);
}

array.isRequired = chain(array, isRequired);

function arrayOf() {}

arrayOf.string = chain(
	// test for an array
	array,
	// test array values are all strings
	(value, prop, droplet_name, droplet_type) => {
		var test = true,
			a;

		for (a = 0; a < value.length; a += 1) {
			test = (test ? (typeof value[a] === 'string') : test);
		}

		return assert(
			test,
			prop,
			'Value must be an array containing only strings',
			droplet_name,
			droplet_type
		);
	}
);

arrayOf.string.isRequired = chain(arrayOf.string, isRequired);

export default {
	_chain: chain,
	_assert: assert,
	string,
	object,
	array,
	arrayOf,
	isRequired,
	stringNotEmpty
};