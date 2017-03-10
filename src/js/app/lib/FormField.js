/**
 * FormField data object
 * @typedef FormFieldData
 * @property {boolean} [required]
 * @property {string} [label]
 * @property {mixed} [options]
 * @property {string} [placeholder]
 * @property {mixed} [value]
 * @example
 * var field = FormField('fieldname', 'dropdown', {
 * 	'label': 'Please select a value',
 * 	'options': ['Value 1', 'Value 2', 'Value 3'],
 * 	'value': 'Value 2'
 * });
 */

 /**
 * This class exists almost entirely for data consistency.
 * @class
 * @param {string} name - Field name.
 * @param {string} type - Input type.
 * @param {FormFieldData} data - Field data.
 */
var FormField = function(name, type, data = {}) {
	this._setNameAndType(name, type);
	this._validateAndSet(data);
};

FormField.prototype = {
	_setNameAndType: function(name, type) {
		if (typeof name !== 'string') {
			throw new Error('Invalid field name "' + name + '"');
		} else {
			this.name = name;
		}

		if (typeof type !== 'string' ||
			FormField.validTypes.indexOf(type) === -1) {
			throw new Error('Invalid field type "' + type + '"');
		} else {
			this.type = type;
		}
	},

	_validateAndSet: function(data) {
		var _data = Object.deepAssign({}, data);

		if (FormField.validateDataAttribute(
				_data,
				this.name,
				'Error with FormField data attribute'
			)) {
			this.data = _data;

			// externalise remaining options
			this.required = data.required;
			this.options = data.options;
			this.placeholder = data.placeholder;
			this.label = data.label;

			this.value = (typeof data.value !== 'undefined') ? data.value : '';
		}
	}
};

/**
 * Ensures a form field's data attributes are valid
 */
FormField.validateDataAttribute = function(data, item, error_prefix) {
	var error = error_prefix + ' ' + item + ' - ';

	// check "required" is a boolean, if defined
	if (typeof data.required !== 'undefined' && typeof data.required !== 'boolean') {
		throw new Error(error + '"required" attribute isn’t a boolean true or false');
	}

	// check "options" is valid
	if (typeof data.options !== 'undefined') {
		FormField._validateOptionsSetting(data.options, error);
	}

	// check "placeholder" is valid
	if (typeof data.placeholder !== 'undefined' && typeof data.placeholder !== 'string') {
		throw new Error(error + '"placeholder" attribute isn’t a string');
	}

	// check "value" is valid
	if (typeof data.value !== 'undefined') {
		FormField._validateValueSetting(data.value, data.options, error);
	}

	// check "label" is valid
	if (typeof data.label !== 'undefined' && typeof data.label !== 'string') {
		throw new Error(
			error + '"label" attribute isn’t a string'
		);
	}

	return true;
};

FormField._validateOptionsSetting = function(options, error_prefix) {
	var key, a,
		error = error_prefix + '"options" is of an unrecognised type';

	if (Array.isArray(options)) {
		for (a = 0; a < options.length; a += 1) {
			if (typeof options[a] !== 'string') {
				throw new Error(error);
			}
		}
	} else if (typeof options === 'object' && options !== null) {
		for (key in options) {
			if (typeof key !== 'string' || typeof options[key] !== 'string') {
				throw new Error(error + ' - object values must be a simple key/value set');
			}
		}
	} else if (options === null) {
		throw new Error(error + ' - options cannot be null');
	}

	return true;
};

FormField._validateValueSetting = function(value, options, error_prefix) {
	if (!Array.isArray(value) &&
		typeof value !== 'string' &&
		typeof value !== 'number') {
		throw new Error(
			error_prefix + '"value" is of an unrecognised type'
		);
	}

	if (typeof options !== 'undefined') {
		// validate against options
		if (
			(Array.isArray(options) && options.indexOf(value) === -1) ||
			(
				typeof options === 'object' &&
				!Array.isArray(options) &&
				!options[value]
			)
		) {
			throw new Error(
				error_prefix + '"value" attribute contains an option that doesn’t exist'
			);
		}
	}
};

FormField.validTypes = [
	'text',
	'longtext',
	'dropdown',
	'checkbox',
	'radio'
];

export default FormField;