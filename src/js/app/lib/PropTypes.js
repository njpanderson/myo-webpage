function chain() {
	var args = Array.prototype.slice.call(arguments);

	return function(value, prop) {
		var test = true;

		// run each function in the chain
		args.forEach((fn) => {
			if (!fn.apply(this, [value, prop])) {
				test = false;
			}
		});

		return test;
	};
}

function assert(test, propname, message) {
	if (!test) {
		throw new Error('Error in Droplet prop ' + propname + '. ' + message);
	} else {
		return true;
	}
}

function isRequired(value, prop) {
	return assert((typeof value !== 'undefined' && value !== ''), prop, 'Value is required.');
}

function string(value, prop) {
	return assert(
		(typeof value === 'undefined' || typeof value === 'string'),
		prop,
		'Value must be a string.'
	);
}

string.isRequired = chain(string, isRequired);

function object(value, prop) {
	return assert(typeof value === 'object', prop, 'Value must be an object.');
}

object.isRequired = chain(object, isRequired);

export default {
	string,
	object,
	isRequired
};